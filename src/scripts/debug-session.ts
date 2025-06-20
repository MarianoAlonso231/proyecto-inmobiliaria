#!/usr/bin/env ts-node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno no configuradas');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

async function debugSession() {
  console.log('🔍 Diagnóstico de Sesión y Conectividad\n');
  
  // 1. Verificar conectividad básica
  console.log('1️⃣ Verificando conectividad a Supabase...');
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Error de conectividad:', error.message);
      if (error.message.includes('JWT') || error.message.includes('expired')) {
        console.log('🔒 Problema de autenticación detectado');
      }
    } else {
      console.log('✅ Conectividad básica OK');
    }
  } catch (error) {
    console.error('💥 Error crítico de conectividad:', error);
  }
  
  // 2. Verificar estado de la sesión actual
  console.log('\n2️⃣ Verificando estado de sesión...');
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error al obtener sesión:', error.message);
    } else if (session) {
      console.log('✅ Sesión activa encontrada');
      console.log('   Usuario:', session.user.email);
      console.log('   Expira en:', new Date(session.expires_at! * 1000).toLocaleString());
      
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = session.expires_at! - now;
      console.log(`   Tiempo restante: ${Math.floor(timeLeft / 60)} minutos`);
      
      if (timeLeft < 300) { // Menos de 5 minutos
        console.log('⚠️ La sesión expirará pronto');
      }
    } else {
      console.log('🚪 No hay sesión activa');
    }
  } catch (error) {
    console.error('💥 Error crítico al verificar sesión:', error);
  }
  
  // 3. Probar operación de lectura
  console.log('\n3️⃣ Probando operación de lectura...');
  try {
    const start = Date.now();
    const { data, error } = await supabase
      .from('properties')
      .select('id, title')
      .limit(5);
    
    const duration = Date.now() - start;
    
    if (error) {
      console.error('❌ Error en lectura:', error.message);
      console.error('   Código:', error.code);
      console.error('   Detalles:', error.details);
    } else {
      console.log(`✅ Lectura exitosa en ${duration}ms`);
      console.log(`   Propiedades encontradas: ${data.length}`);
    }
  } catch (error) {
    console.error('💥 Error crítico en lectura:', error);
  }
  
  // 4. Probar operación de escritura (con rollback)
  console.log('\n4️⃣ Probando operación de escritura...');
  try {
    const testData = {
      title: `TEST_${Date.now()}`,
      description: 'Propiedad de prueba - ELIMINAR',
      price: 1,
      currency: 'USD',
      operation_type: 'venta',
      property_type: 'casa',
      bedrooms: 1,
      bathrooms: 1,
      address: 'Test Address',
      city: 'Test City',
      province: 'Test Province',
      country: 'Test Country',
      features: ['test'],
      images: [],
      featured: false,
      status: 'disponible'
    };
    
    const start = Date.now();
    const { data, error } = await supabase
      .from('properties')
      .insert([testData])
      .select('id')
      .single();
    
    const duration = Date.now() - start;
    
    if (error) {
      console.error('❌ Error en escritura:', error.message);
      console.error('   Código:', error.code);
      if (error.message.includes('JWT') || error.message.includes('expired')) {
        console.log('🔒 Problema de autenticación en escritura');
      }
    } else {
      console.log(`✅ Escritura exitosa en ${duration}ms`);
      console.log('   ID creado:', data.id);
      
      // Limpiar: eliminar el registro de prueba
      await supabase.from('properties').delete().eq('id', data.id);
      console.log('🧹 Registro de prueba eliminado');
    }
  } catch (error) {
    console.error('💥 Error crítico en escritura:', error);
  }
  
  // 5. Verificar bucket de Storage
  console.log('\n5️⃣ Verificando Storage...');
  try {
    const { data, error } = await supabase.storage
      .from('properties-images')
      .list('', { limit: 1 });
    
    if (error) {
      console.error('❌ Error en Storage:', error.message);
    } else {
      console.log('✅ Storage accesible');
      console.log(`   Archivos en bucket: ${data.length > 0 ? 'Sí' : 'Vacío'}`);
    }
  } catch (error) {
    console.error('💥 Error crítico en Storage:', error);
  }
  
  console.log('\n📋 Resumen del diagnóstico completado');
}

debugSession().catch(console.error); 