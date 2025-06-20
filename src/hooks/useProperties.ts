import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { deletePropertySafely } from '@/lib/supabase/cleanup';
import { logger } from '@/lib/logger';
import { uploadImage } from '@/lib/supabase/storage';
import { ImageItem } from '@/components/ImageUploaderDeferred';
import { withSupabaseTimeout } from '@/lib/timeout-helper';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  operation_type: 'venta' | 'alquiler';
  property_type: 'casa' | 'apartamento' | 'oficina' | 'local' | 'terreno';
  bedrooms: number;
  bathrooms: number;
  construccion: number;
  terreno?: number;
  address: string;
  neighborhood?: string;
  city: string;
  province: string;
  country: string;
  latitude?: number;
  longitude?: number;
  features: string[];
  images: string[];
  featured: boolean;
  status: 'disponible' | 'vendido' | 'alquilado' | 'reservado';
  // Campos específicos para terrenos
  barrio_cerrado?: boolean;
  es_country?: boolean;
  paga_expensas?: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  currency: string;
  operation_type: string;
  property_type: string;
  bedrooms: string;
  bathrooms: string;
  construccion: string;
  terreno: string;
  address: string;
  neighborhood: string;
  city: string;
  province: string;
  country: string;
  latitude: string;
  longitude: string;
  features: string;
  images: ImageItem[];
  featured: boolean;
  status: string;
  // Campos específicos para terrenos
  barrio_cerrado: boolean;
  es_country: boolean;
  paga_expensas: boolean;
}

export const initialFormData: PropertyFormData = {
  title: '',
  description: '',
  price: '',
  currency: 'USD',
  operation_type: '',
  property_type: '',
  bedrooms: '0',
  bathrooms: '0',
  construccion: '',
  terreno: '',
  address: '',
  neighborhood: '',
  city: 'San Miguel de Tucumán',
  province: 'Tucumán',
  country: 'Argentina',
  latitude: '',
  longitude: '',
  features: '',
  images: [],
  featured: false,
  status: 'disponible',
  // Campos específicos para terrenos
  barrio_cerrado: false,
  es_country: false,
  paga_expensas: false
};

// Función con timeout para evitar colgadas
async function ensureValidSession(): Promise<{ isValid: boolean; error?: string }> {
  try {
    console.log('🔐 Validando sesión antes de operación...');
    
    // Timeout de 10 segundos para getSession
    const sessionPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout al obtener sesión')), 10000)
    );
    
    const { data: { session }, error: sessionError } = await Promise.race([
      sessionPromise, 
      timeoutPromise
    ]) as any;
    
    if (sessionError) {
      console.error('❌ Error al obtener sesión:', sessionError);
      return { isValid: false, error: 'Error al verificar la sesión' };
    }
    
    if (!session) {
      console.error('❌ No hay sesión activa');
      return { isValid: false, error: 'No hay sesión activa' };
    }
    
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = session.expires_at || 0;
    const timeToExpiry = expiresAt - now;
    
    console.log('⏰ Token expira en:', timeToExpiry, 'segundos');
    
    if (timeToExpiry < 300) {
      console.log('🔄 Token próximo a expirar, renovando sesión...');
      
      // Timeout de 15 segundos para refreshSession
      const refreshPromise = supabase.auth.refreshSession();
      const refreshTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout al renovar sesión')), 15000)
      );
      
      const { data: refreshData, error: refreshError } = await Promise.race([
        refreshPromise, 
        refreshTimeoutPromise
      ]) as any;
      
      if (refreshError || !refreshData.session) {
        console.error('❌ Error al renovar sesión:', refreshError);
        return { isValid: false, error: 'No se pudo renovar la sesión. Por favor, inicia sesión nuevamente.' };
      }
      
      console.log('✅ Sesión renovada exitosamente');
    } else {
      console.log('✅ Sesión válida');
    }
    
    return { isValid: true };
    
  } catch (error) {
    console.error('❌ Error crítico al validar sesión:', error);
    return { isValid: false, error: 'Error interno al validar la sesión' };
  }
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Agregar ref para evitar race conditions y múltiples llamadas simultáneas
  const loadingRef = useRef(false);

  const loadProperties = async () => {
    // Prevenir múltiples llamadas simultáneas
    if (loadingRef.current) {
      logger.warn('⚠️ loadProperties ya está ejecutándose, ignorando llamada duplicada');
      return;
    }

    try {
      loadingRef.current = true;
      setIsLoading(true);
      setError(null);
      logger.admin('📊 Cargando propiedades...');
      
      // Timeout de 12 segundos para cargar propiedades
      const propertiesPromise = supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout al cargar propiedades')), 12000)
      );
      
      const { data, error } = await Promise.race([
        propertiesPromise, 
        timeoutPromise
      ]) as any;

      if (error) {
        // Detectar errores de autenticación específicos
        if (error.message.includes('JWT') || error.message.includes('expired') || error.message.includes('unauthorized')) {
          logger.error('❌ Error de autenticación detectado:', error);
          setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
          // Redirigir al login después de un breve delay
          setTimeout(() => {
            window.location.href = '/admin/login';
          }, 2000);
          return;
        }
        throw error;
      }

      logger.admin(`✅ Propiedades cargadas: ${data?.length || 0}`);
      setProperties(data || []);
    } catch (error) {
      logger.error('❌ Error al cargar propiedades:', error);
      setError('Error al cargar las propiedades');
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  };

  const createProperty = async (formData: PropertyFormData): Promise<boolean> => {
    try {
      setError(null);
      console.log('🆕 Iniciando creación de nueva propiedad...');

      // 1. Validar y renovar sesión si es necesario
      const sessionValidation = await ensureValidSession();
      if (!sessionValidation.isValid) {
        console.error('❌ Sesión inválida:', sessionValidation.error);
        setError(sessionValidation.error || 'Sesión expirada. Por favor, inicia sesión nuevamente.');
        
        // Redirigir al login después de un breve delay
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
        return false;
      }

      // 2. Validaciones básicas
      if (!formData.title || !formData.price || !formData.operation_type || !formData.property_type) {
        console.warn('⚠️ Validación falló: campos obligatorios faltantes');
        setError('Por favor completa todos los campos obligatorios');
        return false;
      }

      console.log('✅ Validaciones básicas pasadas');

      // 1. Subir imágenes nuevas primero
      const uploadedImageUrls: string[] = [];
      const filesToUpload = formData.images.filter(item => item.type === 'file' && item.file);
      
      if (filesToUpload.length > 0) {
        console.log(`📤 Subiendo ${filesToUpload.length} imágenes nuevas para nueva propiedad...`);
        
        for (let index = 0; index < filesToUpload.length; index++) {
          const imageItem = filesToUpload[index];
          if (imageItem.file) {
            console.log(`📷 Subiendo imagen ${index + 1}/${filesToUpload.length}:`, imageItem.file.name);
            const uploadResult = await uploadImage(imageItem.file);
            if (uploadResult.success && uploadResult.url) {
              uploadedImageUrls.push(uploadResult.url);
              console.log(`✅ Imagen ${index + 1} subida exitosamente`);
            } else {
              console.error(`❌ Error subiendo imagen ${index + 1}:`, uploadResult.error);
              
              // Detectar errores de autenticación en la subida de imágenes
              if (uploadResult.authError) {
                console.error('🔒 Error de autenticación detectado en subida de imagen');
                setError('Sesión expirada durante la subida de imágenes. Por favor, inicia sesión nuevamente.');
                
                // Redirigir al login después de un breve delay
                setTimeout(() => {
                  window.location.href = '/admin/login';
                }, 2000);
                return false;
              }
              
              setError(`Error al subir imagen ${imageItem.file.name}: ${uploadResult.error}`);
              return false;
            }
          }
        }
        console.log(`🎉 Todas las ${uploadedImageUrls.length} imágenes subidas exitosamente`);
      } else {
        console.log('📝 No hay imágenes nuevas para subir');
      }

      // 2. Combinar URLs existentes con las recién subidas
      const existingUrls = formData.images
        .filter(item => item.type === 'url' && item.url)
        .map(item => item.url!);
      
      const allImageUrls = [...existingUrls, ...uploadedImageUrls];
      console.log(`🖼️ Total de imágenes para la propiedad: ${allImageUrls.length}`);

      // 3. Preparar datos para envío
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        operation_type: formData.operation_type,
        property_type: formData.property_type,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        construccion: parseFloat(formData.construccion) || null,
        terreno: formData.terreno ? parseFloat(formData.terreno) : null,
        address: formData.address,
        neighborhood: formData.neighborhood,
        city: formData.city,
        province: formData.province,
        country: formData.country,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        features: formData.features ? formData.features.split(',').map((f: string) => f.trim()) : [],
        images: allImageUrls,
        featured: formData.featured,
        status: formData.status,
        // Campos específicos para terrenos
        barrio_cerrado: formData.barrio_cerrado,
        es_country: formData.es_country,
        paga_expensas: formData.paga_expensas
      };

      // Debug de coordenadas (solo en desarrollo)
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 DEBUG - Coordenadas antes de enviar:', {
          latitude_raw: formData.latitude,
          longitude_raw: formData.longitude,
          latitude_parsed: propertyData.latitude,
          longitude_parsed: propertyData.longitude
        });
      }

      // Validación específica de coordenadas
      if (formData.latitude && (isNaN(parseFloat(formData.latitude)) || !isFinite(parseFloat(formData.latitude)))) {
        console.error('❌ ERROR - Latitud inválida:', formData.latitude);
        setError(`Valor de latitud inválido: "${formData.latitude}". Debe ser un número decimal válido.`);
        return false;
      }
      
      if (formData.longitude && (isNaN(parseFloat(formData.longitude)) || !isFinite(parseFloat(formData.longitude)))) {
        console.error('❌ ERROR - Longitud inválida:', formData.longitude);
        setError(`Valor de longitud inválido: "${formData.longitude}". Debe ser un número decimal válido.`);
        return false;
      }

      // Validación de rango de coordenadas
      if (propertyData.latitude !== null && (propertyData.latitude < -90 || propertyData.latitude > 90)) {
        console.error('❌ ERROR - Latitud fuera de rango:', propertyData.latitude);
        setError(`Latitud fuera de rango: ${propertyData.latitude}. Debe estar entre -90 y 90.`);
        return false;
      }
      
      if (propertyData.longitude !== null && (propertyData.longitude < -180 || propertyData.longitude > 180)) {
        console.error('❌ ERROR - Longitud fuera de rango:', propertyData.longitude);
        setError(`Longitud fuera de rango: ${propertyData.longitude}. Debe estar entre -180 y 180.`);
        return false;
      }

      console.log('✅ Validación de coordenadas pasada');

      console.log('📊 Datos de nueva propiedad preparados:', {
        title: propertyData.title,
        price: propertyData.price,
        currency: propertyData.currency,
        operation_type: propertyData.operation_type,
        property_type: propertyData.property_type,
        images_count: propertyData.images.length,
        features_count: propertyData.features.length,
        latitude: propertyData.latitude,
        longitude: propertyData.longitude
      });

      // 4. Intentar crear con manejo de errores de autenticación
      console.log('💾 Ejecutando insert en Supabase...');
      
      let createResult;
      try {
        createResult = await Promise.race([
          supabase
            .from('properties')
            .insert([propertyData])
            .select('id')
            .single(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout: La creación tardó más de 15 segundos')), 15000)
          )
        ]);
      } catch (timeoutError) {
        console.error('❌ Timeout en creación:', timeoutError);
        setError('La creación tardó demasiado tiempo. Verifica tu conexión e intenta nuevamente.');
        return false;
      }
      
      const { data, error } = createResult as { data: any; error: any };

      console.log('📝 Resultado del insert:', error ? 'Error' : 'Éxito');

      if (error) {
        // Detectar errores de autenticación específicos
        if (error.message.includes('JWT') || error.message.includes('expired') || error.message.includes('unauthorized') || error.code === 'PGRST301') {
          console.error('🔒 Error de autenticación detectado en creación:', error);
          setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
          
          // Redirigir al login después de un breve delay
          setTimeout(() => {
            window.location.href = '/admin/login';
          }, 2000);
          return false;
        }

        // Detectar errores específicos de base de datos
        if (error.code === '23505') { // Unique constraint violation
          console.error('🔄 Error de duplicación detectado:', error);
          setError('Ya existe una propiedad con datos similares. Verifica los campos únicos.');
          return false;
        }

        if (error.code === '23502') { // Not null violation
          console.error('📝 Error de campo requerido:', error);
          setError('Faltan campos obligatorios en la base de datos. Contacta al administrador.');
          return false;
        }

        if (error.message.includes('timeout') || error.message.includes('network')) {
          console.error('🌐 Error de red detectado:', error);
          setError('Error de conexión. Verifica tu internet e intenta nuevamente.');
          return false;
        }
        
        throw error;
      }

      console.log('✅ Propiedad creada exitosamente con ID:', data?.id);
      
      // Recargar las propiedades para mostrar la nueva
      console.log('🔄 Recargando lista de propiedades...');
      await loadProperties();
      
      return true;
      
    } catch (error) {
      console.error('❌ Error crítico al crear propiedad:', error);
      
      // Proporcionar más información sobre el error
      if (error instanceof Error) {
        console.error('📋 Detalles del error:', {
          name: error.name,
          message: error.message,
          stack: error.stack?.split('\n')[0] // Solo la primera línea del stack
        });
        
        // Mensajes de error más específicos basados en el tipo
        if (error.message.includes('fetch')) {
          setError('Error de conexión al servidor. Verifica tu internet e intenta nuevamente.');
        } else if (error.message.includes('timeout')) {
          setError('La operación tardó demasiado tiempo. Verifica tu conexión e intenta nuevamente.');
        } else if (error.message.includes('storage')) {
          setError('Error al subir imágenes. Verifica el tamaño y formato de las imágenes.');
        } else {
          setError(`Error al crear la propiedad: ${error.message}`);
        }
      } else {
        console.error('📋 Error desconocido:', error);
        setError('Error desconocido al crear la propiedad. Intenta nuevamente.');
      }
      
      return false;
    }
  };

  const updateProperty = async (id: string, formData: PropertyFormData): Promise<boolean> => {
    try {
      setError(null);
      console.log('🔄 Iniciando actualización de propiedad:', id);

      // 1. Validar y renovar sesión si es necesario
      const sessionValidation = await ensureValidSession();
      if (!sessionValidation.isValid) {
        console.error('❌ Sesión inválida para actualización:', sessionValidation.error);
        setError(sessionValidation.error || 'Sesión expirada. Por favor, inicia sesión nuevamente.');
        
        // Redirigir al login después de un breve delay
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
        return false;
      }

      // 2. Validaciones básicas
      if (!formData.title || !formData.price || !formData.operation_type || !formData.property_type) {
        setError('Por favor completa todos los campos obligatorios');
        return false;
      }

      // 1. Subir imágenes nuevas primero
      const uploadedImageUrls: string[] = [];
      const filesToUpload = formData.images.filter(item => item.type === 'file' && item.file);
      
      if (filesToUpload.length > 0) {
        console.log(`📤 Subiendo ${filesToUpload.length} imágenes nuevas...`);
        
        for (const imageItem of filesToUpload) {
          if (imageItem.file) {
            const uploadResult = await uploadImage(imageItem.file);
            if (uploadResult.success && uploadResult.url) {
              uploadedImageUrls.push(uploadResult.url);
            } else {
              console.error(`Error subiendo imagen:`, uploadResult.error);
              setError(`Error al subir imagen: ${uploadResult.error}`);
              return false;
            }
          }
        }
      }

      // 2. Combinar URLs existentes con las recién subidas
      const existingUrls = formData.images
        .filter(item => item.type === 'url' && item.url)
        .map(item => item.url!);
      
      const allImageUrls = [...existingUrls, ...uploadedImageUrls];

      // 3. Preparar datos para envío
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        operation_type: formData.operation_type,
        property_type: formData.property_type,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        construccion: parseFloat(formData.construccion) || null,
        terreno: formData.terreno ? parseFloat(formData.terreno) : null,
        address: formData.address,
        neighborhood: formData.neighborhood,
        city: formData.city,
        province: formData.province,
        country: formData.country,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        features: formData.features ? formData.features.split(',').map((f: string) => f.trim()) : [],
        images: allImageUrls,
        featured: formData.featured,
        status: formData.status,
        // Campos específicos para terrenos
        barrio_cerrado: formData.barrio_cerrado,
        es_country: formData.es_country,
        paga_expensas: formData.paga_expensas
      };

      // Validación específica de coordenadas para actualización
      if (formData.latitude && (isNaN(parseFloat(formData.latitude)) || !isFinite(parseFloat(formData.latitude)))) {
        console.error('❌ ERROR - Latitud inválida en actualización:', formData.latitude);
        setError(`Valor de latitud inválido: "${formData.latitude}". Debe ser un número decimal válido.`);
        return false;
      }
      
      if (formData.longitude && (isNaN(parseFloat(formData.longitude)) || !isFinite(parseFloat(formData.longitude)))) {
        console.error('❌ ERROR - Longitud inválida en actualización:', formData.longitude);
        setError(`Valor de longitud inválido: "${formData.longitude}". Debe ser un número decimal válido.`);
        return false;
      }

      // Validación de rango de coordenadas para actualización
      if (propertyData.latitude !== null && (propertyData.latitude < -90 || propertyData.latitude > 90)) {
        console.error('❌ ERROR - Latitud fuera de rango en actualización:', propertyData.latitude);
        setError(`Latitud fuera de rango: ${propertyData.latitude}. Debe estar entre -90 y 90.`);
        return false;
      }
      
      if (propertyData.longitude !== null && (propertyData.longitude < -180 || propertyData.longitude > 180)) {
        console.error('❌ ERROR - Longitud fuera de rango en actualización:', propertyData.longitude);
        setError(`Longitud fuera de rango: ${propertyData.longitude}. Debe estar entre -180 y 180.`);
        return false;
      }

      console.log('🔍 DEBUG - Coordenadas para actualización:', {
        latitude_raw: formData.latitude,
        longitude_raw: formData.longitude,
        latitude_parsed: propertyData.latitude,
        longitude_parsed: propertyData.longitude
      });

      console.log('📊 Datos a actualizar:', propertyData);

      // 4. Intentar actualizar con manejo de errores de autenticación
      console.log('🔄 Ejecutando update en Supabase...');
      
      // Agrega esto ANTES de cualquier operación de actualización
      console.log('=== ANTES DE ACTUALIZAR ===');
      console.log('Session:', (await supabase.auth.getSession()).data.session?.user?.id);
      
      let updateResult;
      try {
        updateResult = await Promise.race([
          supabase
            .from('properties')
            .update(propertyData)
            .eq('id', id),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout: La actualización tardó más de 15 segundos')), 15000)
          )
        ]);
      } catch (timeoutError) {
        console.error('❌ Timeout en actualización:', timeoutError);
        setError('La actualización tardó demasiado tiempo. Verifica tu conexión e intenta nuevamente.');
        return false;
      }
      
      // Y después de la operación
      console.log('=== DESPUÉS DE ACTUALIZAR ===');
      console.log('Session:', (await supabase.auth.getSession()).data.session?.user?.id);
      
      const { error } = updateResult as { error: any };
      
      console.log('📝 Resultado del update:', error ? 'Error' : 'Éxito');

      if (error) {
        // Detectar errores de autenticación específicos
        if (error.message.includes('JWT') || error.message.includes('expired') || error.message.includes('unauthorized') || error.code === 'PGRST301') {
          console.error('🔒 Error de autenticación detectado en actualización:', error);
          setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
          
          // Redirigir al login después de un breve delay
          setTimeout(() => {
            window.location.href = '/admin/login';
          }, 2000);
          return false;
        }
        
        throw error;
      }

      console.log('✅ Propiedad actualizada exitosamente');
      await loadProperties(); // Recargar las propiedades
      return true;
      
    } catch (error) {
      console.error('❌ Error al actualizar propiedad:', error);
      
      // Proporcionar más información sobre el error
      if (error instanceof Error) {
        setError(`Error al actualizar la propiedad: ${error.message}`);
      } else {
        setError('Error desconocido al actualizar la propiedad');
      }
      
      return false;
    }
  };

  const deleteProperty = async (id: string): Promise<boolean> => {
    try {
      setError(null);

      // Usar eliminación segura que incluye imágenes del Storage
      const result = await deletePropertySafely(id);

      if (!result.success) {
        throw new Error(result.error || 'Error al eliminar la propiedad');
      }

      await loadProperties(); // Recargar las propiedades
      return true;
      
    } catch (error) {
      console.error('Error al eliminar propiedad:', error);
      setError(error instanceof Error ? error.message : 'Error al eliminar la propiedad');
      return false;
    }
  };

  const propertyToFormData = (property: Property): PropertyFormData => {
    // Convertir URLs de imágenes a ImageItem[]
    const imageItems: ImageItem[] = property.images.map(url => ({
      id: `url_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'url' as const,
      url,
      preview: url
    }));

    return {
      title: property.title,
      description: property.description || '',
      price: property.price.toString(),
      currency: property.currency,
      operation_type: property.operation_type,
      property_type: property.property_type,
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      construccion: property.construccion?.toString() || '',
      terreno: property.terreno?.toString() || '',
      address: property.address || '',
      neighborhood: property.neighborhood || '',
      city: property.city,
      province: property.province,
      country: property.country,
      latitude: property.latitude?.toString() || '',
      longitude: property.longitude?.toString() || '',
      features: property.features.join(', '),
      images: imageItems,
      featured: property.featured,
      status: property.status,
      // Campos específicos para terrenos
      barrio_cerrado: property.barrio_cerrado || false,
      es_country: property.es_country || false,
      paga_expensas: property.paga_expensas || false
    };
  };

  // Cargar propiedades al inicializar el hook
  useEffect(() => {
    loadProperties();
  }, []);

  // Hook adicional para forzar recarga en desarrollo si hay problemas
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && properties.length === 0 && !isLoading) {
        logger.admin('🔄 Página visible sin propiedades, recargando...');
        loadProperties();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [properties.length, isLoading]);

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      // Limpiar refs
      loadingRef.current = false;
    };
  }, []);

  // Estadísticas derivadas
  const stats = {
    total: properties.length,
    ventas: properties.filter(p => p.operation_type === 'venta').length,
    alquileres: properties.filter(p => p.operation_type === 'alquiler').length,
    destacadas: properties.filter(p => p.featured).length,
    disponibles: properties.filter(p => p.status === 'disponible').length,
    vendidas: properties.filter(p => p.status === 'vendido').length,
    alquiladas: properties.filter(p => p.status === 'alquilado').length,
    reservadas: properties.filter(p => p.status === 'reservado').length
  };

  return {
    properties,
    isLoading,
    error,
    stats,
    loadProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    propertyToFormData,
    clearError: () => setError(null)
  };
}

// Hook específico para propiedades destacadas
export function useFeaturedProperties(limit = 6) {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Protección contra race conditions
  const loadingRef = useRef(false);

  const loadFeaturedProperties = async () => {
    // Prevenir múltiples llamadas simultáneas
    if (loadingRef.current) {
      logger.public('⚠️ loadFeaturedProperties ya está ejecutándose, ignorando llamada duplicada');
      return;
    }

    try {
      loadingRef.current = true;
      setIsLoading(true);
      setError(null);
      logger.public('📊 Cargando propiedades destacadas...');
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('featured', true)
        .eq('status', 'disponible')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        logger.critical('❌ Error en consulta de propiedades destacadas:', error);
        throw error;
      }

      logger.public(`✅ Propiedades destacadas cargadas: ${data?.length || 0}`);
      if (data && data.length > 0) {
        logger.public('🏠 Primeras propiedades destacadas:', data.slice(0, 2).map(p => ({ id: p.id, title: p.title, featured: p.featured })));
      }
      setFeaturedProperties(data || []);
    } catch (error) {
      logger.critical('❌ Error al cargar propiedades destacadas:', error);
      setError('Error al cargar las propiedades destacadas');
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedProperties();
  }, [limit]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      loadingRef.current = false;
    };
  }, []);

  return {
    featuredProperties,
    isLoading,
    error,
    loadFeaturedProperties,
    clearError: () => setError(null)
  };
} 