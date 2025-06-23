import { supabase } from '@/lib/supabase';
import { deletePropertySafely } from './cleanup';
import { convertImageToWebP } from '@/lib/image-converter';

const BUCKET_NAME = 'properties-images';

export async function uploadImage(file: File): Promise<{ success: boolean; url?: string; error?: string; authError?: boolean }> {
  try {
    console.log(`📤 Iniciando subida de imagen: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      console.warn('⚠️ Tipo de archivo inválido:', file.type);
      return { success: false, error: 'El archivo debe ser una imagen' };
    }

    // Validar tamaño (5MB máximo antes de conversión)
    if (file.size > 5 * 1024 * 1024) {
      console.warn('⚠️ Archivo demasiado grande:', `${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return { success: false, error: 'La imagen es demasiado grande (máximo 5MB)' };
    }

    console.log('✅ Validaciones de archivo pasadas');

    // Convertir imagen a WebP para optimización
    console.log('🔄 Convirtiendo imagen a WebP...');
    const conversionResult = await convertImageToWebP(file, {
      quality: 0.85, // Calidad alta pero optimizada
      maxWidth: 1920, // Máximo 1920px de ancho
      maxHeight: 1080 // Máximo 1080px de alto
    });

    if (!conversionResult.success || !conversionResult.file) {
      console.warn('⚠️ Error en conversión a WebP, usando archivo original:', conversionResult.error);
      // Si falla la conversión, usar el archivo original
      var finalFile = file;
    } else {
      console.log('✅ Imagen convertida a WebP exitosamente');
      var finalFile = conversionResult.file;
    }

    // Generar nombre único (siempre con extensión .webp si la conversión fue exitosa)
    const originalName = file.name.split('.').slice(0, -1).join('');
    const fileExtension = finalFile.type === 'image/webp' ? 'webp' : file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}_${originalName}.${fileExtension}`;
    console.log('📁 Nombre de archivo generado:', fileName);

    // Subir archivo con mejor manejo de errores
    console.log('🔄 Ejecutando upload a Storage...');
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, finalFile);

    if (error) {
      console.error('❌ Error en upload:', error);
      
      // Detectar errores de autenticación específicos
      if (error.message.includes('JWT') || error.message.includes('expired') || error.message.includes('unauthorized') || error.message.includes('token')) {
        console.error('🔒 Error de autenticación detectado en upload:', error);
        return { 
          success: false, 
          error: 'Sesión expirada durante la subida de imagen. Inicia sesión nuevamente.',
          authError: true 
        };
      }

      // Detectar errores de Storage específicos
      if (error.message.includes('Bucket not found')) {
        console.error('🪣 Bucket no encontrado:', error);
        return { 
          success: false, 
          error: 'Configuración de almacenamiento incorrecta. Contacta al administrador.' 
        };
      }

      if (error.message.includes('File size')) {
        console.error('📏 Error de tamaño:', error);
        return { 
          success: false, 
          error: 'La imagen es demasiado grande para el servidor.' 
        };
      }

      if (error.message.includes('network') || error.message.includes('timeout')) {
        console.error('🌐 Error de red en upload:', error);
        return { 
          success: false, 
          error: 'Error de conexión durante la subida. Verifica tu internet e intenta nuevamente.' 
        };
      }

      return { success: false, error: `Error al subir: ${error.message}` };
    }

    console.log('✅ Upload exitoso, obteniendo URL pública...');

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    if (!urlData?.publicUrl) {
      console.error('❌ No se pudo generar URL pública');
      return { success: false, error: 'Error al generar URL de la imagen' };
    }

    console.log('🎉 Imagen subida exitosamente:', urlData.publicUrl);
    return { success: true, url: urlData.publicUrl };

  } catch (error) {
    console.error('💥 Error crítico en uploadImage:', error);
    
    if (error instanceof Error) {
      // Proporcionar más información sobre el error
      if (error.message.includes('fetch')) {
        return { success: false, error: 'Error de conexión al subir la imagen. Verifica tu internet.' };
      } else if (error.message.includes('timeout')) {
        return { success: false, error: 'La subida tardó demasiado tiempo. Intenta con una imagen más pequeña.' };
      } else {
        return { success: false, error: `Error inesperado: ${error.message}` };
      }
    }
    
    return { success: false, error: 'Error desconocido al subir la imagen' };
  }
}

/**
 * Función para eliminar una propiedad de forma segura
 * Elimina tanto la propiedad de la DB como sus imágenes del Storage
 */
export async function deleteProperty(propertyId: string): Promise<{ success: boolean; error?: string; deletedImages?: number }> {
  return await deletePropertySafely(propertyId);
}