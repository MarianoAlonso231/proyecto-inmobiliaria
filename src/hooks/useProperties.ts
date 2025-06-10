import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { deletePropertySafely } from '@/lib/supabase/cleanup';
import { uploadImage } from '@/lib/supabase/storage';
import { ImageItem } from '@/components/ImageUploaderDeferred';

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
  area_m2: number;
  lot_area_m2?: number;
  address: string;
  neighborhood: string;
  city: string;
  province: string;
  country: string;
  latitude?: number;
  longitude?: number;
  features: string[];
  images: string[];
  featured: boolean;
  status: 'disponible' | 'vendido' | 'alquilado' | 'reservado';
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
  area_m2: string;
  lot_area_m2: string;
  address: string;
  neighborhood: string;
  city: string;
  province: string;
  country: string;
  features: string;
  images: ImageItem[]; // Cambiado de string a ImageItem[]
  featured: boolean;
  status: string;
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
  area_m2: '',
  lot_area_m2: '',
  address: '',
  neighborhood: '',
  city: 'San Miguel de Tucumán',
  province: 'Tucumán',
  country: 'Argentina',
  features: '',
  images: [],
  featured: false,
  status: 'disponible'
};

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProperties(data || []);
    } catch (error) {
      console.error('Error al cargar propiedades:', error);
      setError('Error al cargar las propiedades');
    } finally {
      setIsLoading(false);
    }
  };

  const createProperty = async (formData: PropertyFormData): Promise<boolean> => {
    try {
      setError(null);

      // Validaciones básicas
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
        area_m2: parseFloat(formData.area_m2) || null,
        lot_area_m2: formData.lot_area_m2 ? parseFloat(formData.lot_area_m2) : null,
        address: formData.address,
        neighborhood: formData.neighborhood,
        city: formData.city,
        province: formData.province,
        country: formData.country,
        features: formData.features ? formData.features.split(',').map((f: string) => f.trim()) : [],
        images: allImageUrls,
        featured: formData.featured,
        status: formData.status
      };

      const { error } = await supabase
        .from('properties')
        .insert([propertyData]);

      if (error) {
        throw error;
      }

      await loadProperties(); // Recargar las propiedades
      return true;
      
    } catch (error) {
      console.error('Error al crear propiedad:', error);
      setError('Error al crear la propiedad');
      return false;
    }
  };

  const updateProperty = async (id: string, formData: PropertyFormData): Promise<boolean> => {
    try {
      setError(null);

      // Validaciones básicas
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
        area_m2: parseFloat(formData.area_m2) || null,
        lot_area_m2: formData.lot_area_m2 ? parseFloat(formData.lot_area_m2) : null,
        address: formData.address,
        neighborhood: formData.neighborhood,
        city: formData.city,
        province: formData.province,
        country: formData.country,
        features: formData.features ? formData.features.split(',').map((f: string) => f.trim()) : [],
        images: allImageUrls,
        featured: formData.featured,
        status: formData.status
      };

      const { error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', id);

      if (error) {
        throw error;
      }

      await loadProperties(); // Recargar las propiedades
      return true;
      
    } catch (error) {
      console.error('Error al actualizar propiedad:', error);
      setError('Error al actualizar la propiedad');
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
      area_m2: property.area_m2?.toString() || '',
      lot_area_m2: property.lot_area_m2?.toString() || '',
      address: property.address || '',
      neighborhood: property.neighborhood || '',
      city: property.city,
      province: property.province,
      country: property.country,
      features: property.features.join(', '),
      images: imageItems,
      featured: property.featured,
      status: property.status
    };
  };

  // Cargar propiedades al inicializar el hook
  useEffect(() => {
    loadProperties();
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

  const loadFeaturedProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('featured', true)
        .eq('status', 'disponible')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      setFeaturedProperties(data || []);
    } catch (error) {
      console.error('Error al cargar propiedades destacadas:', error);
      setError('Error al cargar las propiedades destacadas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedProperties();
  }, [limit]);

  return {
    featuredProperties,
    isLoading,
    error,
    loadFeaturedProperties,
    clearError: () => setError(null)
  };
} 