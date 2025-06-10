import { supabase } from '@/lib/supabase';

const BUCKET_NAME = 'properties-images';

// Función para detectar la URL base dinámicamente
async function detectBaseUrl(): Promise<string> {
  try {
    // Intentar obtener una URL pública de ejemplo para detectar el patrón
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl('test-file.jpg'); // Archivo que no necesita existir
    
    if (data?.publicUrl) {
      // Extraer la base URL removiendo el nombre del archivo de prueba
      const baseUrl = data.publicUrl.replace('test-file.jpg', '');
      console.log(`🔍 URL base detectada: ${baseUrl}`);
      return baseUrl;
    }
  } catch (error) {
    console.warn('No se pudo detectar URL base dinámicamente, usando fallback');
  }
  
  // Fallback a la URL hardcodeada original
  return `https://wxlzstrodefylrgzr.supabase.co/storage/v1/object/public/${BUCKET_NAME}/`;
}

// Variable global para la URL base que se detectará dinámicamente
let DETECTED_BASE_URL: string | null = null;

/**
 * Interfaz para el resultado del análisis de imágenes huérfanas
 */
interface OrphanAnalysis {
  totalFilesInStorage: number;
  totalReferencedImages: number;
  orphanedFiles: string[];
  referencedFiles: string[];
}

/**
 * Extrae el nombre del archivo de una URL completa del Storage
 * VERSIÓN MEJORADA: Más robusta para diferentes formatos de URL
 */
function extractFileNameFromUrl(url: string, baseUrl?: string): string | null {
  try {
    // Verificar que la URL contenga el nombre del bucket
    if (!url.includes(BUCKET_NAME)) {
      console.warn(`URL no contiene el bucket ${BUCKET_NAME}: ${url}`);
      return null;
    }

    // Método 1: Intentar con la URL base detectada/proporcionada
    if (baseUrl && url.includes(baseUrl)) {
      const fileName = url.replace(baseUrl, '');
      console.log(`✅ Método 1 - Nombre extraído: ${fileName}`);
      return fileName;
    }

    // Método 2: Buscar el patrón /bucket-name/ y extraer lo que sigue
    const bucketPattern = `/${BUCKET_NAME}/`;
    const bucketIndex = url.indexOf(bucketPattern);
    if (bucketIndex !== -1) {
      const fileName = url.substring(bucketIndex + bucketPattern.length);
      console.log(`✅ Método 2 - Nombre extraído: ${fileName}`);
      return fileName;
    }

    // Método 3: Buscar el patrón bucket-name/ (sin slash inicial)
    const bucketPattern2 = `${BUCKET_NAME}/`;
    const bucketIndex2 = url.indexOf(bucketPattern2);
    if (bucketIndex2 !== -1) {
      const fileName = url.substring(bucketIndex2 + bucketPattern2.length);
      console.log(`✅ Método 3 - Nombre extraído: ${fileName}`);
      return fileName;
    }

    // Método 4: Como último recurso, tomar la última parte después del último /
    const urlParts = url.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    if (lastPart && lastPart.includes('.')) { // Verificar que tenga extensión
      console.log(`⚠️ Método 4 (último recurso) - Nombre extraído: ${lastPart}`);
      return lastPart;
    }

    console.error(`❌ No se pudo extraer nombre de archivo de: ${url}`);
    return null;
  } catch (error) {
    console.error('Error al extraer nombre de archivo:', error);
    return null;
  }
}

/**
 * 1. Función para identificar imágenes huérfanas
 * Compara los archivos en el Storage con las referencias en la base de datos
 */
export async function findOrphanedImages(): Promise<{ success: boolean; data?: OrphanAnalysis; error?: string }> {
  try {
    console.log('🔍 Iniciando análisis de imágenes huérfanas...');

    // 0. Detectar la URL base dinámicamente
    if (!DETECTED_BASE_URL) {
      DETECTED_BASE_URL = await detectBaseUrl();
    }
    console.log(`🌐 Usando URL base: ${DETECTED_BASE_URL}`);

    // 1. Obtener todos los archivos del bucket
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .list();

    if (storageError) {
      return { success: false, error: `Error al obtener archivos del Storage: ${storageError.message}` };
    }

    if (!storageFiles || storageFiles.length === 0) {
      console.log('✅ No hay archivos en el Storage');
      return { 
        success: true, 
        data: { 
          totalFilesInStorage: 0, 
          totalReferencedImages: 0, 
          orphanedFiles: [], 
          referencedFiles: [] 
        } 
      };
    }

    const filesInStorage = storageFiles.map(file => file.name);
    console.log(`📁 Archivos encontrados en Storage: ${filesInStorage.length}`);

    // 2. Obtener todas las URLs de imágenes de la tabla properties
    const { data: properties, error: dbError } = await supabase
      .from('properties')
      .select('images');

    if (dbError) {
      return { success: false, error: `Error al obtener propiedades: ${dbError.message}` };
    }

    // 3. Extraer todos los nombres de archivo referenciados en la DB
    const referencedFiles = new Set<string>();
    let totalImageUrls = 0;
    let successfulExtractions = 0;
    
    console.log('🔗 Procesando URLs de imágenes en la base de datos...');
    
    if (properties && properties.length > 0) {
      properties.forEach((property, propIndex) => {
        console.log(`📋 Propiedad ${propIndex + 1}: ${property.images?.length || 0} imágenes`);
        
        if (property.images && Array.isArray(property.images)) {
          property.images.forEach((imageUrl: string, imgIndex: number) => {
            totalImageUrls++;
            console.log(`   🖼️  Imagen ${imgIndex + 1}: ${imageUrl}`);
            
            const fileName = extractFileNameFromUrl(imageUrl, DETECTED_BASE_URL || undefined);
            if (fileName) {
              referencedFiles.add(fileName);
              successfulExtractions++;
              console.log(`      ✅ Archivo referenciado: ${fileName}`);
            } else {
              console.error(`      ❌ No se pudo extraer nombre de archivo de: ${imageUrl}`);
            }
          });
        }
      });
    }

    console.log(`📊 URLs procesadas: ${totalImageUrls}`);
    console.log(`✅ Extracciones exitosas: ${successfulExtractions}`);
    console.log(`❌ Extracciones fallidas: ${totalImageUrls - successfulExtractions}`);
    console.log(`🔗 Archivos únicos referenciados: ${referencedFiles.size}`);

    // 4. Encontrar archivos huérfanos
    const orphanedFiles = filesInStorage.filter(fileName => !referencedFiles.has(fileName));

    console.log(`🗑️ Imágenes huérfanas encontradas: ${orphanedFiles.length}`);

    const result: OrphanAnalysis = {
      totalFilesInStorage: filesInStorage.length,
      totalReferencedImages: referencedFiles.size,
      orphanedFiles,
      referencedFiles: Array.from(referencedFiles)
    };

    return { success: true, data: result };

  } catch (error) {
    console.error('Error en findOrphanedImages:', error);
    return { success: false, error: 'Error interno al analizar imágenes huérfanas' };
  }
}

/**
 * 2. Función de limpieza masiva
 * Elimina archivos huérfanos del Storage
 */
export async function cleanupOrphanedImages(dryRun: boolean = true): Promise<{ success: boolean; deletedCount?: number; errors?: string[]; error?: string }> {
  try {
    console.log(`🧹 Iniciando limpieza de imágenes huérfanas (modo: ${dryRun ? 'simulación' : 'real'})...`);

    // Primero encontrar las imágenes huérfanas
    const analysisResult = await findOrphanedImages();
    
    if (!analysisResult.success || !analysisResult.data) {
      return { success: false, error: analysisResult.error };
    }

    const analysis = analysisResult.data;
    const orphanedFiles = analysis.orphanedFiles;
    
    // VERIFICACIÓN DE SEGURIDAD: Si no se encontraron archivos referenciados,
    // pero sí hay archivos en storage, algo está mal - NO ELIMINAR
    if (analysis.totalReferencedImages === 0 && analysis.totalFilesInStorage > 0) {
      const errorMsg = `🚨 PELIGRO: No se encontraron imágenes referenciadas en la DB, pero hay ${analysis.totalFilesInStorage} archivos en Storage. Esto sugiere un error en la extracción de nombres de archivo. LIMPIEZA CANCELADA POR SEGURIDAD.`;
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }
    
    // VERIFICACIÓN DE SEGURIDAD: Si más del 90% de archivos serían eliminados, pedir confirmación
    if (analysis.totalFilesInStorage > 0) {
      const percentageToDelete = (orphanedFiles.length / analysis.totalFilesInStorage) * 100;
      if (percentageToDelete > 90) {
        const warningMsg = `⚠️ ADVERTENCIA: Se eliminarían ${orphanedFiles.length} de ${analysis.totalFilesInStorage} archivos (${percentageToDelete.toFixed(1)}%). Esto es sospechoso - por favor revisa manualmente.`;
        console.warn(warningMsg);
        if (!dryRun) {
          return { success: false, error: warningMsg };
        }
      }
    }

    if (orphanedFiles.length === 0) {
      console.log('✅ No hay imágenes huérfanas para eliminar');
      return { success: true, deletedCount: 0, errors: [] };
    }

    if (dryRun) {
      console.log('🔍 SIMULACIÓN - Archivos que se eliminarían:');
      orphanedFiles.forEach(fileName => console.log(`  - ${fileName}`));
      return { success: true, deletedCount: orphanedFiles.length, errors: [] };
    }

    // Eliminar en lotes para evitar problemas de límite de API
    const BATCH_SIZE = 10;
    const errors: string[] = [];
    let totalDeleted = 0;

    for (let i = 0; i < orphanedFiles.length; i += BATCH_SIZE) {
      const batch = orphanedFiles.slice(i, i + BATCH_SIZE);
      
      console.log(`🗑️ Eliminando lote ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(orphanedFiles.length / BATCH_SIZE)}`);
      
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(batch);

      if (error) {
        errors.push(`Error en lote ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`);
        console.error(`❌ Error eliminando lote:`, error);
      } else {
        totalDeleted += batch.length;
        console.log(`✅ Eliminados ${batch.length} archivos del lote`);
      }

      // Pausa pequeña entre lotes para no sobrecargar la API
      if (i + BATCH_SIZE < orphanedFiles.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`🎉 Limpieza completada. Archivos eliminados: ${totalDeleted}/${orphanedFiles.length}`);

    return {
      success: true,
      deletedCount: totalDeleted,
      errors: errors.length > 0 ? errors : undefined
    };

  } catch (error) {
    console.error('Error en cleanupOrphanedImages:', error);
    return { success: false, error: 'Error interno al limpiar imágenes huérfanas' };
  }
}

/**
 * 3. Función de eliminación segura de propiedades
 * Elimina una propiedad junto con sus imágenes del Storage
 */
export async function deletePropertySafely(propertyId: string): Promise<{ success: boolean; error?: string; deletedImages?: number }> {
  try {
    console.log(`🏠 Iniciando eliminación segura de propiedad: ${propertyId}`);

    // 0. Detectar URL base si no está disponible
    if (!DETECTED_BASE_URL) {
      DETECTED_BASE_URL = await detectBaseUrl();
    }

    // 1. Obtener la propiedad con sus imágenes
    const { data: property, error: fetchError } = await supabase
      .from('properties')
      .select('images')
      .eq('id', propertyId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return { success: false, error: 'Propiedad no encontrada' };
      }
      return { success: false, error: `Error al obtener propiedad: ${fetchError.message}` };
    }

    // 2. Extraer nombres de archivo de las URLs
    const filesToDelete: string[] = [];
    
    if (property.images && Array.isArray(property.images)) {
      property.images.forEach((imageUrl: string) => {
        const fileName = extractFileNameFromUrl(imageUrl, DETECTED_BASE_URL || undefined);
        if (fileName) {
          filesToDelete.push(fileName);
        }
      });
    }

    console.log(`🖼️ Imágenes a eliminar: ${filesToDelete.length}`);

    // 3. Iniciar transacción: eliminar imágenes del Storage
    let deletedImagesCount = 0;
    if (filesToDelete.length > 0) {
      const { data: storageData, error: storageError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(filesToDelete);

      if (storageError) {
        console.error('❌ Error eliminando imágenes del Storage:', storageError);
        return { success: false, error: `Error al eliminar imágenes: ${storageError.message}` };
      }

      deletedImagesCount = filesToDelete.length;
      console.log(`✅ Eliminadas ${deletedImagesCount} imágenes del Storage`);
    }

    // 4. Eliminar la propiedad de la base de datos
    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (deleteError) {
      console.error('❌ Error eliminando propiedad de la DB:', deleteError);
      // TODO: En un escenario ideal, aquí intentaríamos restaurar las imágenes
      // o implementar un mecanismo de rollback más robusto
      return { success: false, error: `Error al eliminar propiedad: ${deleteError.message}` };
    }

    console.log(`🎉 Propiedad eliminada exitosamente: ${propertyId}`);

    return {
      success: true,
      deletedImages: deletedImagesCount
    };

  } catch (error) {
    console.error('Error en deletePropertySafely:', error);
    return { success: false, error: 'Error interno al eliminar propiedad' };
  }
}

/**
 * 4. Script de mantenimiento periódico
 * Función que se puede ejecutar como cron job o manualmente
 */
export async function maintenanceCleanup(options: {
  dryRun?: boolean;
  maxOrphanAge?: number; // días
  batchSize?: number;
} = {}): Promise<{ success: boolean; report?: string; error?: string }> {
  try {
    const { dryRun = true, maxOrphanAge = 7, batchSize = 10 } = options;
    
    console.log('🔧 Iniciando mantenimiento de Storage...');
    console.log(`⚙️ Configuración: dryRun=${dryRun}, maxOrphanAge=${maxOrphanAge} días`);

    const report: string[] = [];
    report.push('=== REPORTE DE MANTENIMIENTO DE STORAGE ===');
    report.push(`Fecha: ${new Date().toISOString()}`);
    report.push(`Modo: ${dryRun ? 'SIMULACIÓN' : 'REAL'}`);
    report.push('');

    // 1. Análisis de imágenes huérfanas
    const analysisResult = await findOrphanedImages();
    
    if (!analysisResult.success) {
      return { success: false, error: analysisResult.error };
    }

    const analysis = analysisResult.data!;
    report.push(`📊 ESTADÍSTICAS:`);
    report.push(`  - Total archivos en Storage: ${analysis.totalFilesInStorage}`);
    report.push(`  - Total imágenes referenciadas: ${analysis.totalReferencedImages}`);
    report.push(`  - Imágenes huérfanas encontradas: ${analysis.orphanedFiles.length}`);
    report.push('');

    if (analysis.orphanedFiles.length === 0) {
      report.push('✅ No se encontraron imágenes huérfanas');
      const finalReport = report.join('\n');
      console.log(finalReport);
      return { success: true, report: finalReport };
    }

    // 2. Limpieza de imágenes huérfanas
    const cleanupResult = await cleanupOrphanedImages(dryRun);
    
    if (!cleanupResult.success) {
      return { success: false, error: cleanupResult.error };
    }

    report.push(`🧹 LIMPIEZA:`);
    if (dryRun) {
      report.push(`  - Archivos que se eliminarían: ${cleanupResult.deletedCount}`);
    } else {
      report.push(`  - Archivos eliminados: ${cleanupResult.deletedCount}`);
      if (cleanupResult.errors && cleanupResult.errors.length > 0) {
        report.push(`  - Errores: ${cleanupResult.errors.length}`);
        cleanupResult.errors.forEach(error => {
          report.push(`    * ${error}`);
        });
      }
    }

    report.push('');
    report.push('=== FIN DEL REPORTE ===');

    const finalReport = report.join('\n');
    console.log(finalReport);

    return { success: true, report: finalReport };

  } catch (error) {
    console.error('Error en maintenanceCleanup:', error);
    return { success: false, error: 'Error interno en mantenimiento' };
  }
}

/**
 * Función de utilidad para obtener estadísticas del Storage
 */
export async function getStorageStats(): Promise<{ success: boolean; stats?: any; error?: string }> {
  try {
    const analysisResult = await findOrphanedImages();
    
    if (!analysisResult.success) {
      return { success: false, error: analysisResult.error };
    }

    const analysis = analysisResult.data!;
    
    const stats = {
      totalFiles: analysis.totalFilesInStorage,
      referencedImages: analysis.totalReferencedImages,
      orphanedImages: analysis.orphanedFiles.length,
      storageHealth: analysis.orphanedFiles.length === 0 ? 'excelente' : 
                    analysis.orphanedFiles.length < 5 ? 'bueno' : 
                    analysis.orphanedFiles.length < 20 ? 'regular' : 'requiere_atencion',
      lastCheck: new Date().toISOString()
    };

    return { success: true, stats };

  } catch (error) {
    console.error('Error en getStorageStats:', error);
    return { success: false, error: 'Error interno al obtener estadísticas' };
  }
} 