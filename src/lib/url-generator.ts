/**
 * Sistema de generación de URLs SEO-friendly para inmobiliaria
 * Crea URLs semánticamente correctas que incluyen keywords relevantes
 */

import { TUCUMAN_LOCATIONS, PROPERTY_TYPES, OPERATIONS } from '@/lib/seo';

export interface URLFilters {
  operation?: 'venta' | 'alquiler';
  propertyType?: keyof typeof PROPERTY_TYPES;
  location?: keyof typeof TUCUMAN_LOCATIONS;
  bedrooms?: string;
  priceMin?: string;
  priceMax?: string;
  neighborhood?: string;
}

/**
 * Convierte texto a formato URL-friendly (slug)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remover acentos
    .replace(/[^a-z0-9 ]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno
    .trim();
}

/**
 * Genera URL SEO-friendly basada en filtros
 */
export function generatePropertyURL(filters: URLFilters): string {
  const segments: string[] = [];
  
  // Agregar operación (venta/alquiler)
  if (filters.operation) {
    segments.push(filters.operation === 'venta' ? 'ventas' : 'alquileres');
  } else {
    segments.push('propiedades');
  }

  // Agregar tipo de propiedad
  if (filters.propertyType) {
    const typeSlug = slugify(PROPERTY_TYPES[filters.propertyType]);
    segments.push(typeSlug + 's'); // Pluralizar
  }

  // Agregar ubicación
  if (filters.location) {
    const locationSlug = slugify(TUCUMAN_LOCATIONS[filters.location]);
    segments.push(locationSlug);
  }

  // Construir la URL base
  let url = '/' + segments.join('/');

  // Agregar parámetros de query para filtros específicos
  const queryParams = new URLSearchParams();
  
  if (filters.bedrooms && filters.bedrooms !== 'cualquiera') {
    queryParams.append('dormitorios', filters.bedrooms);
  }
  
  if (filters.priceMin) {
    queryParams.append('precio-min', filters.priceMin);
  }
  
  if (filters.priceMax) {
    queryParams.append('precio-max', filters.priceMax);
  }

  if (filters.neighborhood) {
    queryParams.append('barrio', slugify(filters.neighborhood));
  }

  // Agregar query string si hay parámetros
  const queryString = queryParams.toString();
  if (queryString) {
    url += '?' + queryString;
  }

  return url;
}

/**
 * Genera títulos de página dinámicos basados en URL
 */
export function generatePageTitle(filters: URLFilters): string {
  const parts: string[] = [];

  // Tipo de propiedad
  if (filters.propertyType) {
    const propertyName = PROPERTY_TYPES[filters.propertyType];
    parts.push(propertyName + 's');
  } else {
    parts.push('Propiedades');
  }

  // Operación
  if (filters.operation) {
    parts.push('en ' + OPERATIONS[filters.operation]);
  }

  // Ubicación
  if (filters.location) {
    parts.push('en ' + TUCUMAN_LOCATIONS[filters.location]);
  } else {
    parts.push('en Tucumán');
  }

  // Dormitorios
  if (filters.bedrooms && filters.bedrooms !== 'cualquiera') {
    const bedroomText = filters.bedrooms === '4' ? '4+ Dormitorios' : `${filters.bedrooms} Dormitorios`;
    parts.push('- ' + bedroomText);
  }

  return parts.join(' ');
}

/**
 * Extrae filtros de una URL
 */
export function parseURLFilters(pathname: string, searchParams: URLSearchParams): URLFilters {
  const segments = pathname.split('/').filter(Boolean);
  const filters: URLFilters = {};

  // Analizar segmentos de la URL
  let segmentIndex = 0;

  // Determinar operación
  if (segments[0] === 'ventas') {
    filters.operation = 'venta';
    segmentIndex++;
  } else if (segments[0] === 'alquileres') {
    filters.operation = 'alquiler';
    segmentIndex++;
  } else if (segments[0] === 'propiedades') {
    segmentIndex++;
  }

  // Determinar tipo de propiedad
  if (segments[segmentIndex]) {
    const typeSlug = segments[segmentIndex];
    for (const [key, value] of Object.entries(PROPERTY_TYPES)) {
      if (slugify(value + 's') === typeSlug) {
        filters.propertyType = key as keyof typeof PROPERTY_TYPES;
        segmentIndex++;
        break;
      }
    }
  }

  // Determinar ubicación
  if (segments[segmentIndex]) {
    const locationSlug = segments[segmentIndex];
    for (const [key, value] of Object.entries(TUCUMAN_LOCATIONS)) {
      if (slugify(value) === locationSlug) {
        filters.location = key as keyof typeof TUCUMAN_LOCATIONS;
        break;
      }
    }
  }

  // Leer parámetros de query
  filters.bedrooms = searchParams.get('dormitorios') || undefined;
  filters.priceMin = searchParams.get('precio-min') || undefined;
  filters.priceMax = searchParams.get('precio-max') || undefined;
  filters.neighborhood = searchParams.get('barrio') || undefined;

  return filters;
}

/**
 * Genera breadcrumbs basados en URL
 */
export function generateURLBreadcrumbs(filters: URLFilters) {
  const breadcrumbs = [
    { label: 'Inicio', href: '/', active: false }
  ];

  // Nivel de operación
  if (filters.operation) {
    const operationLabel = filters.operation === 'venta' ? 'Ventas' : 'Alquileres';
    const operationHref = filters.operation === 'venta' ? '/ventas' : '/alquileres';
    breadcrumbs.push({ label: operationLabel, href: operationHref, active: false });
  }

  // Nivel de tipo de propiedad
  if (filters.propertyType) {
    const typeLabel = PROPERTY_TYPES[filters.propertyType] + 's';
    const typeHref = generatePropertyURL({
      operation: filters.operation,
      propertyType: filters.propertyType
    });
    breadcrumbs.push({ label: typeLabel, href: typeHref, active: false });
  }

  // Nivel de ubicación
  if (filters.location) {
    const locationLabel = TUCUMAN_LOCATIONS[filters.location];
    const locationHref = generatePropertyURL({
      operation: filters.operation,
      propertyType: filters.propertyType,
      location: filters.location
    });
    breadcrumbs.push({ label: locationLabel, href: locationHref, active: false });
  }

  // Marcar el último como activo
  if (breadcrumbs.length > 1) {
    breadcrumbs[breadcrumbs.length - 1].active = true;
  }

  return breadcrumbs;
}

/**
 * Genera sugerencias de URLs relacionadas
 */
export function generateRelatedURLs(filters: URLFilters): Array<{label: string, href: string, description: string}> {
  const related = [];

  // Si hay ubicación, sugerir otras ubicaciones
  if (filters.location) {
    const otherLocations = Object.entries(TUCUMAN_LOCATIONS)
      .filter(([key]) => key !== filters.location)
      .slice(0, 3);

    for (const [key, value] of otherLocations) {
      const relatedFilters = { ...filters, location: key as keyof typeof TUCUMAN_LOCATIONS };
      related.push({
        label: `${filters.propertyType ? PROPERTY_TYPES[filters.propertyType] + 's' : 'Propiedades'} en ${value}`,
        href: generatePropertyURL(relatedFilters),
        description: `Ver propiedades disponibles en ${value}, Tucumán`
      });
    }
  }

  // Si hay tipo de propiedad, sugerir otros tipos
  if (filters.propertyType) {
    const otherTypes = Object.entries(PROPERTY_TYPES)
      .filter(([key]) => key !== filters.propertyType)
      .slice(0, 2);

    for (const [key, value] of otherTypes) {
      const relatedFilters = { ...filters, propertyType: key as keyof typeof PROPERTY_TYPES };
      related.push({
        label: `${value}s ${filters.operation ? 'en ' + OPERATIONS[filters.operation] : ''}`,
        href: generatePropertyURL(relatedFilters),
        description: `Explorar ${value.toLowerCase()}s disponibles en Tucumán`
      });
    }
  }

  // Sugerir operación opuesta
  if (filters.operation) {
    const oppositeOperation: 'venta' | 'alquiler' = filters.operation === 'venta' ? 'alquiler' : 'venta';
    const relatedFilters = { ...filters, operation: oppositeOperation };
    const operationLabel = oppositeOperation === 'venta' ? 'Venta' : 'Alquiler';
    
    related.push({
      label: `${filters.propertyType ? PROPERTY_TYPES[filters.propertyType] + 's' : 'Propiedades'} en ${operationLabel}`,
      href: generatePropertyURL(relatedFilters),
      description: `Ver propiedades para ${operationLabel.toLowerCase()} en la misma zona`
    });
  }

  return related.slice(0, 5); // Limitar a 5 sugerencias
}

export default {
  generatePropertyURL,
  generatePageTitle,
  parseURLFilters,
  generateURLBreadcrumbs,
  generateRelatedURLs,
  slugify
}; 