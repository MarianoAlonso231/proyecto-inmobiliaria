/**
 * Sistema de SEO dinámico para inmobiliaria en Tucumán
 * Genera metadatos optimizados basados en tipo de página, operación y ubicación
 */

import { Metadata } from 'next';

// Tipos de páginas para SEO
export type PageType = 'home' | 'ventas' | 'alquileres' | 'propiedades' | 'terrenos' | 'departamentos' | 'casas' | 'contacto' | 'tasacion' | 'property-detail';

// Ubicaciones principales de Tucumán
export const TUCUMAN_LOCATIONS = {
  'san-miguel-de-tucuman': 'San Miguel de Tucumán',
  'yerba-buena': 'Yerba Buena',
  'tafi-viejo': 'Tafí Viejo',
  'el-manantial': 'El Manantial',
  'centro': 'Centro',
  'villa-carlos-paz': 'Villa Carlos Paz',
  'barrio-norte': 'Barrio Norte',
  'nueva-tucuman': 'Nueva Tucumán'
};

// Tipos de propiedades
export const PROPERTY_TYPES = {
  'casa': 'Casa',
  'departamento': 'Departamento',
  'apartamento': 'Departamento',
  'terreno': 'Terreno',
  'oficina': 'Oficina',
  'local': 'Local Comercial'
};

// Operaciones
export const OPERATIONS = {
  'venta': 'Venta',
  'alquiler': 'Alquiler'
};

interface SEOConfig {
  pageType: PageType;
  operation?: 'venta' | 'alquiler';
  propertyType?: keyof typeof PROPERTY_TYPES;
  location?: keyof typeof TUCUMAN_LOCATIONS;
  propertyTitle?: string;
  propertyPrice?: number;
  bedrooms?: number;
  area?: number;
  customTitle?: string;
  customDescription?: string;
}

const BRAND_NAME = "Group Inmobiliaria";
const BRAND_DOMAIN = "https://grupoinmobiliaria.com.ar";

// Keywords principales categorizadas
const KEYWORDS = {
  main: [
    'inmobiliaria en Tucumán',
    'casas en venta Tucumán',
    'terrenos en Tucumán',
    'alquileres en Tucumán',
    'departamentos en Tucumán',
    'bienes raíces Tucumán',
    'propiedades en Tucumán'
  ],
  transactional: [
    'comprar casa en Tucumán',
    'alquilar departamento Tucumán',
    'venta de propiedades en Tucumán',
    'inmobiliaria profesional Tucumán',
    'inmobiliarias recomendadas en Tucumán',
    'invertir en propiedades Tucumán'
  ],
  longTail: [
    'casas con pileta en Tucumán',
    'terrenos económicos en Tucumán',
    'departamentos amueblados en San Miguel de Tucumán',
    'alquiler temporal Tucumán centro',
    'casa moderna en Yerba Buena Tucumán',
    'propiedades nuevas en venta Tucumán'
  ],
  clientOriented: [
    'inmobiliaria para estudiantes Tucumán',
    'alquiler para familias Tucumán',
    'casas para inversión en Tucumán',
    'inmobiliaria con asesoramiento legal Tucumán',
    'propiedades con financiación en Tucumán'
  ]
};

/**
 * Genera el título SEO optimizado
 */
function generateTitle(config: SEOConfig): string {
  if (config.customTitle) return config.customTitle;

  const { pageType, operation, propertyType, location, propertyTitle } = config;

  // Título para detalle de propiedad
  if (pageType === 'property-detail' && propertyTitle) {
    const locationName = location ? TUCUMAN_LOCATIONS[location] : 'Tucumán';
    const operationText = operation ? OPERATIONS[operation] : '';
    return `${propertyTitle} ${operationText} en ${locationName} | ${BRAND_NAME}`;
  }

  // Títulos para páginas de listado
  const titleMappings: Record<PageType, string> = {
    'home': `${BRAND_NAME} - Inmobiliaria en Tucumán | Casas, Departamentos y Terrenos`,
    'ventas': `Casas en Venta Tucumán - Propiedades Nuevas y Usadas | ${BRAND_NAME}`,
    'alquileres': `Alquileres en Tucumán - Casas y Departamentos Disponibles | ${BRAND_NAME}`,
    'propiedades': `Propiedades en Tucumán - Bienes Raíces de Calidad | ${BRAND_NAME}`,
    'terrenos': `Terrenos en Venta Tucumán - Lotes Económicos y Premium | ${BRAND_NAME}`,
    'departamentos': `Departamentos en Tucumán - Alquiler y Venta | ${BRAND_NAME}`,
    'casas': `Casas en Tucumán - Encuentra tu Hogar Ideal | ${BRAND_NAME}`,
    'contacto': `Contacto - Inmobiliaria en Tucumán | ${BRAND_NAME}`,
    'tasacion': `Tasación Gratuita de Propiedades en Tucumán | ${BRAND_NAME}`,
    'property-detail': `Propiedad en Tucumán | ${BRAND_NAME}`
  };

  let baseTitle = titleMappings[pageType] || titleMappings['home'];

  // Customizar según filtros
  if (location && propertyType && operation) {
    const locationName = TUCUMAN_LOCATIONS[location];
    const propType = PROPERTY_TYPES[propertyType];
    const operationText = OPERATIONS[operation];
    baseTitle = `${propType}s en ${operationText} ${locationName} Tucumán | ${BRAND_NAME}`;
  } else if (location && operation) {
    const locationName = TUCUMAN_LOCATIONS[location];
    const operationText = OPERATIONS[operation];
    baseTitle = `Propiedades en ${operationText} ${locationName} Tucumán | ${BRAND_NAME}`;
  } else if (propertyType && operation) {
    const propType = PROPERTY_TYPES[propertyType];
    const operationText = OPERATIONS[operation];
    baseTitle = `${propType}s en ${operationText} Tucumán | ${BRAND_NAME}`;
  }

  return baseTitle;
}

/**
 * Genera la descripción SEO optimizada
 */
function generateDescription(config: SEOConfig): string {
  if (config.customDescription) return config.customDescription;

  const { pageType, operation, propertyType, location, propertyPrice, bedrooms, area } = config;

  // Descripción para detalle de propiedad
  if (pageType === 'property-detail') {
    const locationName = location ? TUCUMAN_LOCATIONS[location] : 'Tucumán';
    const operationText = operation ? OPERATIONS[operation] : '';
    const propType = propertyType ? PROPERTY_TYPES[propertyType] : 'Propiedad';
    const priceText = propertyPrice ? `$${propertyPrice.toLocaleString()}` : '';
    const bedroomText = bedrooms ? `${bedrooms} dormitorios` : '';
    const areaText = area ? `${area}m²` : '';
    
    return `${propType} en ${operationText.toLowerCase()} en ${locationName}. ${priceText} ${bedroomText} ${areaText}. Inmobiliaria en Tucumán con asesoramiento personalizado. ¡Consultá ahora!`.replace(/\s+/g, ' ').trim();
  }

  // Descripciones para páginas de listado
  const descriptionMappings: Record<PageType, string> = {
    'home': `Inmobiliaria líder en Tucumán. Encontrá casas en venta, departamentos en alquiler, terrenos y propiedades de inversión. Asesoramiento personalizado y financiación disponible. ¡Tu próximo hogar te está esperando!`,
    'ventas': `Descubrí las mejores casas en venta en Tucumán. Propiedades nuevas y usadas en Yerba Buena, San Miguel de Tucumán y más ubicaciones. Inmobiliaria profesional con asesoramiento legal. ¡Comprá tu casa ideal!`,
    'alquileres': `Alquileres en Tucumán - Casas y departamentos disponibles para familias y estudiantes. Propiedades amuebladas y sin amueblar en las mejores zonas. Contratos flexibles y precios accesibles.`,
    'propiedades': `Explorá todas nuestras propiedades en Tucumán. Casas, departamentos, terrenos y oficinas en venta y alquiler. Bienes raíces de calidad con la mejor atención personalizada.`,
    'terrenos': `Terrenos en venta en Tucumán - Lotes económicos y premium para construcción e inversión. Ubicaciones estratégicas en Yerba Buena, Tafí Viejo y más zonas de crecimiento.`,
    'departamentos': `Departamentos en Tucumán para alquiler y venta. Desde studios hasta 3 dormitorios en San Miguel de Tucumán, Yerba Buena y centro. Modernos y bien ubicados.`,
    'casas': `Casas en Tucumán - Encontrá tu hogar ideal. Propiedades familiares con jardín, pileta y garaje. Financiación disponible y asesoramiento completo para tu compra.`,
    'contacto': `Contactate con nuestra inmobiliaria en Tucumán. Asesoramiento personalizado en compra, venta y alquiler de propiedades. Atención profesional y resultados garantizados.`,
    'tasacion': `Tasación gratuita de propiedades en Tucumán. Evaluamos tu casa, departamento o terreno con criterios de mercado actualizados. Servicios profesionales de bienes raíces.`,
    'property-detail': `Propiedad disponible en Tucumán. Inmobiliaria especializada con amplia experiencia en el mercado local. Consultá condiciones y financiación disponible.`
  };

  let baseDescription = descriptionMappings[pageType] || descriptionMappings['home'];

  // Customizar según filtros
  if (location && propertyType && operation) {
    const locationName = TUCUMAN_LOCATIONS[location];
    const propType = PROPERTY_TYPES[propertyType];
    const operationText = operation === 'venta' ? 'venta' : 'alquiler';
    baseDescription = `${propType}s en ${operationText} en ${locationName}, Tucumán. Inmobiliaria profesional con propiedades de calidad y precios competitivos. Asesoramiento personalizado y financiación disponible.`;
  }

  return baseDescription;
}

/**
 * Genera keywords relevantes
 */
function generateKeywords(config: SEOConfig): string[] {
  const { pageType, operation, propertyType, location } = config;
  
  let keywords = [...KEYWORDS.main];

  // Agregar keywords específicas según el contexto
  if (operation === 'venta') {
    keywords.push('comprar casa en Tucumán', 'venta de propiedades en Tucumán', 'inmobiliarias recomendadas en Tucumán');
  } else if (operation === 'alquiler') {
    keywords.push('alquilar departamento Tucumán', 'alquiler para familias Tucumán', 'inmobiliaria para estudiantes Tucumán');
  }

  if (propertyType) {
    const propType = PROPERTY_TYPES[propertyType].toLowerCase();
    keywords.push(`${propType}s en Tucumán`, `${propType}s en ${operation || 'venta'} Tucumán`);
  }

  if (location) {
    const locationName = TUCUMAN_LOCATIONS[location];
    keywords.push(`propiedades en ${locationName}`, `${operation || 'venta'} en ${locationName} Tucumán`);
  }

  // Agregar keywords long tail relevantes
  keywords.push(...KEYWORDS.longTail.slice(0, 3));

  return keywords.slice(0, 15); // Limitar a 15 keywords
}

/**
 * Genera URL canónica
 */
function generateCanonicalUrl(config: SEOConfig): string {
  const { pageType } = config;
  
  let path = '';
  
  switch (pageType) {
    case 'home':
      path = '/';
      break;
    case 'ventas':
      path = '/ventas';
      break;
    case 'alquileres':
      path = '/alquileres';
      break;
    case 'propiedades':
      path = '/propiedades';
      break;
    case 'contacto':
      path = '/contacto';
      break;
    case 'tasacion':
      path = '/tasacion';
      break;
    default:
      path = `/${pageType}`;
  }

  return `${BRAND_DOMAIN}${path}`;
}

/**
 * Función principal para generar metadata SEO
 */
export function generateSEOMetadata(config: SEOConfig): Metadata {
  const title = generateTitle(config);
  const description = generateDescription(config);
  const keywords = generateKeywords(config);
  const canonical = generateCanonicalUrl(config);

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: BRAND_NAME }],
    creator: BRAND_NAME,
    publisher: BRAND_NAME,
    // Configuración completa de favicon
    icons: {
      icon: [
        {
          url: '/logo-new.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          url: '/logo-new.png',
          sizes: '16x16',
          type: 'image/png',
        }
      ],
      shortcut: '/logo-new.png',
      apple: [
        {
          url: '/logo-new.png',
          sizes: '180x180',
          type: 'image/png',
        }
      ],
      other: [
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          url: '/logo-new.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          url: '/logo-new.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          url: '/logo-new.png',
        }
      ]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'es_AR',
      url: canonical,
      title,
      description,
      siteName: BRAND_NAME,
      images: [
        {
          url: `${BRAND_DOMAIN}/logo.svg`,
          width: 400,
          height: 400,
          alt: `${BRAND_NAME} - Inmobiliaria en Tucumán`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BRAND_DOMAIN}/logo.svg`],
    },
    alternates: {
      canonical,
    },
    other: {
      'geo.region': 'AR-T',
      'geo.placename': 'Tucumán',
      'geo.position': '-26.8083;-65.2176',
      'ICBM': '-26.8083, -65.2176',
    },
  };
}

/**
 * Genera schema markup para inmobiliaria
 */
export function generateRealEstateSchema(config: SEOConfig) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: BRAND_NAME,
    url: BRAND_DOMAIN,
    logo: `${BRAND_DOMAIN}/logo.svg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Miguel de Tucumán',
      addressRegion: 'Tucumán',
      addressCountry: 'AR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -26.8083,
      longitude: -65.2176,
    },
    areaServed: [
      'San Miguel de Tucumán',
      'Yerba Buena',
      'Tafí Viejo',
      'El Manantial',
      'Tucumán'
    ],
    serviceType: [
      'Venta de propiedades',
      'Alquiler de propiedades',
      'Tasación de propiedades',
      'Asesoramiento inmobiliario'
    ],
  };

  // Schema específico para detalle de propiedad
  if (config.pageType === 'property-detail' && config.propertyTitle) {
    return {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: config.propertyTitle,
      url: generateCanonicalUrl(config),
      offers: {
        '@type': 'Offer',
        price: config.propertyPrice,
        priceCurrency: 'ARS',
        availability: 'https://schema.org/InStock',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: config.location ? TUCUMAN_LOCATIONS[config.location] : 'Tucumán',
        addressRegion: 'Tucumán',
        addressCountry: 'AR',
      },
      realEstateAgent: baseSchema,
    };
  }

  return baseSchema;
}

// Exportar utilidades adicionales
export { KEYWORDS }; 