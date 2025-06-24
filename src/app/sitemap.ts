import { MetadataRoute } from 'next';
import { TUCUMAN_LOCATIONS, PROPERTY_TYPES } from '@/lib/seo';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://groupinmobiliaria.com.ar';
  
  const routes: MetadataRoute.Sitemap = [
    // Páginas principales
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/ventas`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/alquileres`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/propiedades`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tasacion`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Agregar propiedades dinámicas (rutas [id])
  try {
    const { data: properties, error } = await supabase
      .from('properties')
      .select('id, updated_at, status')
      .eq('status', 'disponible'); // Solo propiedades disponibles

    if (!error && properties) {
      for (const property of properties) {
        routes.push({
          url: `${baseUrl}/propiedades/${property.id}`,
          lastModified: new Date(property.updated_at),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }
  } catch (error) {
    console.warn('⚠️ No se pudieron cargar las propiedades para el sitemap:', error);
  }

  // Generar URLs para combinaciones de tipo de propiedad + operación
  const operations = ['ventas', 'alquileres'];
  const propertyTypes = Object.keys(PROPERTY_TYPES);

  for (const operation of operations) {
    for (const [typeKey, typeName] of Object.entries(PROPERTY_TYPES)) {
      const slug = typeName.toLowerCase().replace(/\s+/g, '-') + 's';
      
      routes.push({
        url: `${baseUrl}/${operation}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });

      // Agregar combinaciones con ubicaciones principales
      const mainLocations = ['yerba-buena', 'san-miguel-de-tucuman', 'tafi-viejo'];
      
      for (const locationKey of mainLocations) {
        if (TUCUMAN_LOCATIONS[locationKey as keyof typeof TUCUMAN_LOCATIONS]) {
          const locationSlug = TUCUMAN_LOCATIONS[locationKey as keyof typeof TUCUMAN_LOCATIONS]
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9 ]/g, '')
            .replace(/\s+/g, '-');

          routes.push({
            url: `${baseUrl}/${operation}/${slug}/${locationSlug}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
          });
        }
      }
    }
  }

  // Agregar páginas por ubicación
  for (const [locationKey, locationName] of Object.entries(TUCUMAN_LOCATIONS)) {
    const locationSlug = locationName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-');

    routes.push({
      url: `${baseUrl}/propiedades/${locationSlug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    });
  }

  return routes;
} 