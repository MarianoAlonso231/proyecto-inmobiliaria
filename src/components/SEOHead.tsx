/**
 * Componente SEO reutilizable para generar meta tags y schema markup
 * Optimizado para SEO local de inmobiliaria en Tucumán
 */

'use client';

import { useEffect } from 'react';
import { generateRealEstateSchema, PageType } from '@/lib/seo';

interface SEOHeadProps {
  pageType: PageType;
  operation?: 'venta' | 'alquiler';
  propertyType?: 'casa' | 'departamento' | 'apartamento' | 'terreno' | 'oficina' | 'local';
  location?: string;
  propertyTitle?: string;
  propertyPrice?: number;
  bedrooms?: number;
  area?: number;
  customSchema?: object;
}

export default function SEOHead({
  pageType,
  operation,
  propertyType,
  location,
  propertyTitle,
  propertyPrice,
  bedrooms,
  area,
  customSchema
}: SEOHeadProps) {
  useEffect(() => {
    // Generar y insertar schema markup
    const schema = customSchema || generateRealEstateSchema({
      pageType,
      operation,
      propertyType,
      location: location as any,
      propertyTitle,
      propertyPrice,
      bedrooms,
      area
    });

    // Crear elemento script para schema
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.textContent = JSON.stringify(schema);
    schemaScript.id = 'schema-markup';

    // Remover schema anterior si existe
    const existingSchema = document.getElementById('schema-markup');
    if (existingSchema) {
      existingSchema.remove();
    }

    // Agregar nuevo schema
    document.head.appendChild(schemaScript);

    // Cleanup al desmontar el componente
    return () => {
      const scriptToRemove = document.getElementById('schema-markup');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [pageType, operation, propertyType, location, propertyTitle, propertyPrice, bedrooms, area, customSchema]);

  return null; // Este componente no renderiza nada visible
}

/**
 * Hook para generar alt text optimizado para imágenes de propiedades
 */
export function usePropertyImageAlt(
  propertyType: string,
  operation: string,
  location?: string,
  index?: number
) {
  const baseAlt = `${propertyType} en ${operation}`;
  const locationText = location ? ` en ${location}` : ' en Tucumán';
  const indexText = index ? ` - Imagen ${index}` : '';
  
  return `${baseAlt}${locationText}${indexText} | Group Inmobiliaria`;
}

/**
 * Función para generar breadcrumbs SEO-friendly
 */
export function generateBreadcrumbs(
  pageType: PageType,
  operation?: string,
  propertyType?: string,
  location?: string,
  propertyTitle?: string
) {
  const breadcrumbs = [
    { label: 'Inicio', href: '/', keyword: 'inmobiliaria en Tucumán' }
  ];

  // Agregar nivel de operación
  if (operation === 'venta') {
    breadcrumbs.push({ 
      label: 'Ventas', 
      href: '/ventas',
      keyword: 'casas en venta Tucumán'
    });
  } else if (operation === 'alquiler') {
    breadcrumbs.push({ 
      label: 'Alquileres', 
      href: '/alquileres',
      keyword: 'alquileres en Tucumán'
    });
  } else if (pageType === 'propiedades') {
    breadcrumbs.push({ 
      label: 'Propiedades', 
      href: '/propiedades',
      keyword: 'propiedades en Tucumán'
    });
  }

  // Agregar nivel de tipo de propiedad
  if (propertyType) {
    const typeMap: Record<string, string> = {
      'casa': 'Casas',
      'departamento': 'Departamentos',
      'apartamento': 'Departamentos',
      'terreno': 'Terrenos',
      'oficina': 'Oficinas',
      'local': 'Locales'
    };
    
    const typeLabel = typeMap[propertyType] || propertyType;
    const typeKeyword = `${typeLabel.toLowerCase()} en Tucumán`;
    
    breadcrumbs.push({
      label: typeLabel,
      href: `/${operation || 'propiedades'}?tipo=${propertyType}`,
      keyword: typeKeyword
    });
  }

  // Agregar nivel de ubicación
  if (location) {
    breadcrumbs.push({
      label: location,
      href: `/${operation || 'propiedades'}?ubicacion=${location.toLowerCase().replace(/\s+/g, '-')}`,
      keyword: `propiedades en ${location} Tucumán`
    });
  }

  // Agregar propiedad específica
  if (propertyTitle) {
    breadcrumbs.push({
      label: propertyTitle,
      href: '#',
      keyword: propertyTitle
    });
  }

  return breadcrumbs;
}

/**
 * Componente de Breadcrumbs optimizado para SEO
 */
interface BreadcrumbsProps {
  pageType: PageType;
  operation?: string;
  propertyType?: string;
  location?: string;
  propertyTitle?: string;
  className?: string;
}

export function SEOBreadcrumbs({
  pageType,
  operation,
  propertyType,
  location,
  propertyTitle,
  className = ''
}: BreadcrumbsProps) {
  const breadcrumbs = generateBreadcrumbs(pageType, operation, propertyType, location, propertyTitle);

  // Schema markup para breadcrumbs
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: crumb.href.startsWith('http') ? crumb.href : `https://grupoinmobiliaria.com.ar${crumb.href}`
    }))
  };

  useEffect(() => {
    // Insertar schema de breadcrumbs
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
    breadcrumbScript.id = 'breadcrumb-schema';

    const existingBreadcrumbSchema = document.getElementById('breadcrumb-schema');
    if (existingBreadcrumbSchema) {
      existingBreadcrumbSchema.remove();
    }

    document.head.appendChild(breadcrumbScript);

    return () => {
      const scriptToRemove = document.getElementById('breadcrumb-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [breadcrumbSchema]);

  return (
    <nav className={`flex items-center space-x-2 text-sm text-gray-600 mb-4 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2 text-gray-400">/</span>}
            {crumb.href === '#' ? (
              <span className="text-gray-900 font-medium">{crumb.label}</span>
            ) : (
              <a 
                href={crumb.href}
                className="hover:text-blue-600 transition-colors"
                title={crumb.keyword}
              >
                {crumb.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 