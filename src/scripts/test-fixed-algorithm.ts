#!/usr/bin/env tsx

/**
 * Script de prueba para verificar que el algoritmo corregido funciona correctamente
 * SOLO HACE ANÁLISIS - NO ELIMINA NADA
 */

import { findOrphanedImages } from '@/lib/supabase/cleanup';

async function testFixedAlgorithm() {
  console.log('🧪 PRUEBA DEL ALGORITMO CORREGIDO\n');
  console.log('⚠️  NOTA: Este script solo analiza, NO elimina archivos\n');

  try {
    const result = await findOrphanedImages();
    
    if (!result.success) {
      console.error('❌ Error en el análisis:', result.error);
      return;
    }

    const analysis = result.data!;
    
    console.log('📊 RESULTADOS DEL ANÁLISIS CORREGIDO:\n');
    console.log(`📁 Total archivos en Storage: ${analysis.totalFilesInStorage}`);
    console.log(`🔗 Imágenes referenciadas en DB: ${analysis.totalReferencedImages}`);
    console.log(`🗑️  Imágenes huérfanas detectadas: ${analysis.orphanedFiles.length}`);
    
    // Calcular porcentaje de archivos huérfanos
    if (analysis.totalFilesInStorage > 0) {
      const percentage = (analysis.orphanedFiles.length / analysis.totalFilesInStorage) * 100;
      console.log(`📈 Porcentaje de archivos huérfanos: ${percentage.toFixed(1)}%\n`);
      
      // Evaluación de seguridad
      if (analysis.totalReferencedImages === 0 && analysis.totalFilesInStorage > 0) {
        console.log('🚨 ALERTA DE SEGURIDAD:');
        console.log('   - No se encontraron archivos referenciados');
        console.log('   - Pero hay archivos en Storage');
        console.log('   - Esto indica un problema en la extracción de nombres\n');
      } else if (percentage > 90) {
        console.log('⚠️  ADVERTENCIA:');
        console.log(`   - Se eliminarían ${percentage.toFixed(1)}% de los archivos`);
        console.log('   - Esto es sospechosamente alto\n');
      } else if (percentage === 0) {
        console.log('✅ EXCELENTE:');
        console.log('   - No hay archivos huérfanos');
        console.log('   - El Storage está limpio\n');
      } else {
        console.log('✅ NORMAL:');
        console.log('   - Cantidad razonable de archivos huérfanos');
        console.log('   - La limpieza sería segura\n');
      }
    }

    // Mostrar detalles de archivos referenciados
    if (analysis.referencedFiles.length > 0) {
      console.log('📋 ARCHIVOS REFERENCIADOS ENCONTRADOS:');
      analysis.referencedFiles.forEach((fileName, index) => {
        console.log(`   ${index + 1}. ${fileName}`);
      });
      console.log('');
    }

    // Mostrar archivos huérfanos (máximo 10 para no saturar)
    if (analysis.orphanedFiles.length > 0) {
      console.log('🗑️  ARCHIVOS HUÉRFANOS (primeros 10):');
      const orphansToShow = analysis.orphanedFiles.slice(0, 10);
      orphansToShow.forEach((fileName, index) => {
        console.log(`   ${index + 1}. ${fileName}`);
      });
      
      if (analysis.orphanedFiles.length > 10) {
        console.log(`   ... y ${analysis.orphanedFiles.length - 10} más`);
      }
      console.log('');
    }

    // Recomendaciones
    console.log('💡 RECOMENDACIONES:');
    
    if (analysis.totalReferencedImages === 0 && analysis.totalFilesInStorage > 0) {
      console.log('   ❌ NO ejecutar limpieza - hay un problema en el algoritmo');
      console.log('   📧 Contactar al desarrollador para revisar las URLs en la DB');
    } else if (analysis.orphanedFiles.length === 0) {
      console.log('   ✅ No se necesita limpieza - el Storage está optimizado');
    } else if (analysis.orphanedFiles.length > 0 && analysis.orphanedFiles.length / analysis.totalFilesInStorage < 0.5) {
      console.log('   ✅ Es seguro ejecutar la limpieza');
      console.log('   🧹 Comando: npm run storage:cleanup:dry (primero simular)');
      console.log('   🧹 Comando: npm run storage:cleanup:run (después ejecutar)');
    } else {
      console.log('   ⚠️  Revisar manualmente antes de ejecutar limpieza');
      console.log('   📋 Usar el panel de administración para inspección visual');
    }

  } catch (error) {
    console.error('💥 Error durante la prueba:', error);
  }
}

// Ejecutar la prueba
if (require.main === module) {
  testFixedAlgorithm();
} 