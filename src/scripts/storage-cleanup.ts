#!/usr/bin/env tsx

/**
 * Script de línea de comandos para mantenimiento del Storage de imágenes
 * 
 * Uso:
 * - Análisis: npm run storage:analyze
 * - Simulación: npm run storage:cleanup:dry
 * - Limpieza real: npm run storage:cleanup:run
 * - Estadísticas: npm run storage:stats
 * - Mantenimiento completo: npm run storage:maintenance
 */

import { 
  findOrphanedImages, 
  cleanupOrphanedImages, 
  maintenanceCleanup, 
  getStorageStats 
} from '@/lib/supabase/cleanup';

async function showHelp() {
  console.log(`
🧹 HERRAMIENTAS DE LIMPIEZA DE STORAGE

Comandos disponibles:
  analyze     - Analizar imágenes huérfanas
  cleanup     - Limpiar imágenes huérfanas (--dry-run para simulación)
  maintenance - Ejecutar mantenimiento completo
  stats       - Mostrar estadísticas del Storage
  help        - Mostrar esta ayuda

Ejemplos:
  tsx src/scripts/storage-cleanup.ts analyze
  tsx src/scripts/storage-cleanup.ts cleanup --dry-run
  tsx src/scripts/storage-cleanup.ts cleanup --real
  tsx src/scripts/storage-cleanup.ts maintenance --real
  tsx src/scripts/storage-cleanup.ts stats
`);
}

async function runAnalyze() {
  console.log('🔍 ANALIZANDO IMÁGENES HUÉRFANAS...\n');
  
  const result = await findOrphanedImages();
  
  if (!result.success) {
    console.error('❌ Error:', result.error);
    process.exit(1);
  }

  const analysis = result.data!;
  
  console.log('📊 RESULTADOS DEL ANÁLISIS:');
  console.log(`  Total archivos en Storage: ${analysis.totalFilesInStorage}`);
  console.log(`  Imágenes referenciadas en DB: ${analysis.totalReferencedImages}`);
  console.log(`  Imágenes huérfanas: ${analysis.orphanedFiles.length}`);
  
  if (analysis.orphanedFiles.length > 0) {
    console.log('\n🗑️ ARCHIVOS HUÉRFANOS ENCONTRADOS:');
    analysis.orphanedFiles.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file}`);
    });
    
    console.log('\n💡 Para eliminar estas imágenes, ejecuta:');
    console.log('   tsx src/scripts/storage-cleanup.ts cleanup --real');
  } else {
    console.log('\n✅ ¡No se encontraron imágenes huérfanas!');
  }
}

async function runCleanup(dryRun: boolean) {
  const mode = dryRun ? 'SIMULACIÓN' : 'LIMPIEZA REAL';
  console.log(`🧹 INICIANDO ${mode}...\n`);
  
  if (!dryRun) {
    console.log('⚠️  ATENCIÓN: Vas a eliminar archivos permanentemente.');
    console.log('   Asegúrate de haber hecho un backup si es necesario.\n');
  }
  
  const result = await cleanupOrphanedImages(dryRun);
  
  if (!result.success) {
    console.error('❌ Error:', result.error);
    process.exit(1);
  }
  
  if (dryRun) {
    console.log(`\n🔍 SIMULACIÓN COMPLETADA:`);
    console.log(`  Archivos que se eliminarían: ${result.deletedCount}`);
  } else {
    console.log(`\n🎉 LIMPIEZA COMPLETADA:`);
    console.log(`  Archivos eliminados: ${result.deletedCount}`);
    
    if (result.errors && result.errors.length > 0) {
      console.log(`\n⚠️  ERRORES ENCONTRADOS:`);
      result.errors.forEach(error => console.log(`  - ${error}`));
    }
  }
}

async function runMaintenance(dryRun: boolean) {
  console.log('🔧 EJECUTANDO MANTENIMIENTO COMPLETO...\n');
  
  const result = await maintenanceCleanup({ dryRun });
  
  if (!result.success) {
    console.error('❌ Error:', result.error);
    process.exit(1);
  }
  
  console.log('\n📋 REPORTE DE MANTENIMIENTO:');
  console.log(result.report);
}

async function runStats() {
  console.log('📊 OBTENIENDO ESTADÍSTICAS DEL STORAGE...\n');
  
  const result = await getStorageStats();
  
  if (!result.success) {
    console.error('❌ Error:', result.error);
    process.exit(1);
  }
  
  const stats = result.stats!;
  
  console.log('📈 ESTADÍSTICAS ACTUALES:');
  console.log(`  Total de archivos: ${stats.totalFiles}`);
  console.log(`  Imágenes referenciadas: ${stats.referencedImages}`);
  console.log(`  Imágenes huérfanas: ${stats.orphanedImages}`);
  console.log(`  Estado del Storage: ${stats.storageHealth.toUpperCase()}`);
  console.log(`  Última verificación: ${new Date(stats.lastCheck).toLocaleString()}`);
  
  // Mostrar recomendaciones basadas en el estado
  if (stats.storageHealth === 'requiere_atencion') {
    console.log('\n⚠️  RECOMENDACIÓN: El Storage tiene muchas imágenes huérfanas.');
    console.log('   Considera ejecutar una limpieza pronto.');
  } else if (stats.storageHealth === 'regular') {
    console.log('\n💡 RECOMENDACIÓN: Hay algunas imágenes huérfanas.');
    console.log('   Puedes limpiarlas cuando tengas tiempo.');
  } else if (stats.storageHealth === 'excelente') {
    console.log('\n✅ ¡Excelente! El Storage está limpio y optimizado.');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const isDryRun = args.includes('--dry-run');
  const isReal = args.includes('--real');
  
  // Verificar variables de entorno
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Error: Variables de entorno de Supabase no configuradas');
    console.error('   Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }
  
  try {
    switch (command) {
      case 'analyze':
        await runAnalyze();
        break;
        
      case 'cleanup':
        const dryRunMode = !isReal; // Por defecto es dry-run a menos que se especifique --real
        await runCleanup(dryRunMode);
        break;
        
      case 'maintenance':
        const maintenanceDryRun = !isReal;
        await runMaintenance(maintenanceDryRun);
        break;
        
      case 'stats':
        await runStats();
        break;
        
      case 'help':
      default:
        await showHelp();
        break;
    }
  } catch (error) {
    console.error('💥 Error inesperado:', error);
    process.exit(1);
  }
}

// Ejecutar el script
if (require.main === module) {
  main();
} 