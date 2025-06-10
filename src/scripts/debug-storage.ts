#!/usr/bin/env tsx

/**
 * Script de debugging para verificar el problema en el Storage
 */

import { supabase } from '@/lib/supabase';

async function debugStorageIssue() {
  console.log('🔍 DEBUGGING DEL PROBLEMA DE STORAGE\n');

  try {
    // 1. Verificar conexión a Supabase
    console.log('1. Verificando conexión a Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('properties')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error de conexión:', testError);
      return;
    }
    console.log('✅ Conexión exitosa\n');

    // 2. Obtener propiedades con imágenes
    console.log('2. Obteniendo propiedades con imágenes...');
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('id, title, images');

    if (propertiesError) {
      console.error('❌ Error obteniendo propiedades:', propertiesError);
      return;
    }

    console.log(`📋 Propiedades encontradas: ${properties?.length || 0}\n`);

    // 3. Analizar URLs de imágenes
    if (properties && properties.length > 0) {
      console.log('3. Analizando URLs de imágenes en la base de datos:\n');
      
      properties.forEach((property, index) => {
        console.log(`📄 Propiedad ${index + 1}: "${property.title}" (ID: ${property.id})`);
        
        if (property.images && Array.isArray(property.images)) {
          console.log(`   🖼️  Imágenes (${property.images.length}):`);
          property.images.forEach((imageUrl: string, imgIndex: number) => {
            console.log(`      ${imgIndex + 1}. "${imageUrl}"`);
            
            // Analizar la URL
            const isFullUrl = imageUrl.startsWith('http');
            const containsBucket = imageUrl.includes('properties-images');
            console.log(`         - Es URL completa: ${isFullUrl}`);
            console.log(`         - Contiene bucket: ${containsBucket}`);
            
            if (isFullUrl && containsBucket) {
              // Extraer nombre de archivo
              const parts = imageUrl.split('/');
              const fileName = parts[parts.length - 1];
              console.log(`         - Nombre de archivo extraído: "${fileName}"`);
            }
          });
        } else {
          console.log(`   ❌ No hay imágenes o formato incorrecto`);
          console.log(`   📄 Valor actual: ${JSON.stringify(property.images)}`);
        }
        console.log('');
      });
    } else {
      console.log('❌ No se encontraron propiedades\n');
    }

    // 4. Obtener archivos del Storage
    console.log('4. Obteniendo archivos del Storage...');
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('properties-images')
      .list();

    if (storageError) {
      console.error('❌ Error obteniendo archivos del Storage:', storageError);
      return;
    }

    console.log(`📁 Archivos en Storage: ${storageFiles?.length || 0}\n`);
    
    if (storageFiles && storageFiles.length > 0) {
      console.log('📋 Lista de archivos en Storage:');
      storageFiles.forEach((file, index) => {
        console.log(`   ${index + 1}. "${file.name}" (${file.metadata?.size || 'sin tamaño'} bytes)`);
      });
      console.log('');
    }

    // 5. Simular la lógica de comparación
    console.log('5. Simulando lógica de comparación...\n');
    
    const BASE_URL = 'https://wxlzstrodefylrgzr.supabase.co/storage/v1/object/public/properties-images/';
    const referencedFiles = new Set<string>();
    
    if (properties && properties.length > 0) {
      properties.forEach(property => {
        if (property.images && Array.isArray(property.images)) {
          property.images.forEach((imageUrl: string) => {
            console.log(`🔍 Procesando URL: "${imageUrl}"`);
            
            if (imageUrl.includes(BASE_URL)) {
              const fileName = imageUrl.replace(BASE_URL, '');
              console.log(`   ✅ Nombre extraído: "${fileName}"`);
              referencedFiles.add(fileName);
            } else {
              console.log(`   ❌ URL no coincide con base URL esperada`);
              console.log(`   📄 Base URL esperada: "${BASE_URL}"`);
              
              // Intentar encontrar el patrón real
              if (imageUrl.includes('properties-images/')) {
                const parts = imageUrl.split('properties-images/');
                if (parts.length > 1) {
                  console.log(`   🔧 Nombre de archivo posible: "${parts[1]}"`);
                }
              }
            }
          });
        }
      });
    }

    console.log(`\n📊 RESUMEN:`);
    console.log(`   - Archivos en Storage: ${storageFiles?.length || 0}`);
    console.log(`   - Archivos referenciados detectados: ${referencedFiles.size}`);
    console.log(`   - Archivos que se considerarían huérfanos: ${(storageFiles?.length || 0) - referencedFiles.size}`);
    
    if (referencedFiles.size > 0) {
      console.log(`\n📋 Archivos referenciados encontrados:`);
      Array.from(referencedFiles).forEach((fileName, index) => {
        console.log(`   ${index + 1}. "${fileName}"`);
      });
    }

  } catch (error) {
    console.error('💥 Error durante el debugging:', error);
  }
}

// Ejecutar el debugging
if (require.main === module) {
  debugStorageIssue();
} 