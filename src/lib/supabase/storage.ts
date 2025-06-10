import { supabase } from '@/lib/supabase';
import { deletePropertySafely } from './cleanup';

const BUCKET_NAME = 'properties-images';

export async function uploadImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'El archivo debe ser una imagen' };
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'La imagen es demasiado grande (máximo 5MB)' };
    }

    // Generar nombre único
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Subir archivo
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file);

    if (error) {
      return { success: false, error: error.message };
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return { success: true, url: urlData.publicUrl };

  } catch (error) {
    return { success: false, error: 'Error al subir la imagen' };
  }
}

/**
 * Función para eliminar una propiedad de forma segura
 * Elimina tanto la propiedad de la DB como sus imágenes del Storage
 */
export async function deleteProperty(propertyId: string): Promise<{ success: boolean; error?: string; deletedImages?: number }> {
  return await deletePropertySafely(propertyId);
}