'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Eye, Bed, Bath, Square, DollarSign, Shield, TreePine, Home, Building2, Hash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Property } from '@/hooks/useProperties';
import { formatPrice, getPropertyArea, formatPropertyType } from '@/lib/utils';

// Interfaz para grupos de propiedades
interface PropertyGroup {
  id: string;
  latitude: number;
  longitude: number;
  properties: Property[];
  center: { lat: number; lng: number };
}

// Importación dinámica de los componentes de Leaflet para evitar SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Hook personalizado para importar Leaflet dinámicamente
const useLeaflet = () => {
  const [leaflet, setLeaflet] = useState<any>(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      const L = await import('leaflet');
      setLeaflet(L.default);
    };

    loadLeaflet();
  }, []);

  return leaflet;
};

// Función para agrupar propiedades por ubicación
const groupPropertiesByLocation = (properties: Property[]): PropertyGroup[] => {
  const groups: { [key: string]: Property[] } = {};
  
  // Agrupar propiedades por coordenadas redondeadas (para manejar pequeñas diferencias)
  properties.forEach(property => {
    if (property.latitude && property.longitude) {
      // Redondear a 4 decimales (~11 metros de precisión)
      const roundedLat = Math.round(property.latitude * 10000) / 10000;
      const roundedLng = Math.round(property.longitude * 10000) / 10000;
      const locationKey = `${roundedLat},${roundedLng}`;
      
      if (!groups[locationKey]) {
        groups[locationKey] = [];
      }
      groups[locationKey].push(property);
    }
  });
  
  // Convertir grupos en PropertyGroup
  return Object.entries(groups).map(([locationKey, properties]) => {
    const [lat, lng] = locationKey.split(',').map(Number);
    const avgLat = properties.reduce((sum, p) => sum + p.latitude!, 0) / properties.length;
    const avgLng = properties.reduce((sum, p) => sum + p.longitude!, 0) / properties.length;
    
    return {
      id: locationKey,
      latitude: avgLat,
      longitude: avgLng,
      properties,
      center: { lat: avgLat, lng: avgLng }
    };
  });
};

// Función para crear iconos personalizados usando lucide-react
const createIcon = (L: any, color: string = '#ff8425', type: 'venta' | 'alquiler' = 'venta', count?: number) => {
  if (!L) return null;

  // Si hay múltiples propiedades, usar un icono especial con contador
  if (count && count > 1) {
    const svgIcon = `
      <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow-multiple" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.4)"/>
          </filter>
        </defs>
        <circle cx="25" cy="25" r="22" fill="${color}" filter="url(#shadow-multiple)" stroke="white" stroke-width="3"/>
        <circle cx="25" cy="25" r="16" fill="white" opacity="0.95"/>
        <text x="25" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="${color}">
          ${count}
        </text>
        <circle cx="25" cy="25" r="16" fill="none" stroke="${color}" stroke-width="2" opacity="0.3"/>
      </svg>
    `;
    
    return new L.Icon({
      iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgIcon)}`,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50],
    });
  }

  // Icono normal para una sola propiedad
  const iconSvg = type === 'venta' 
    ? `<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" fill="none"/>
       <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2" fill="none"/>` // Home icon
    : `<path d="M3 21h18" stroke="currentColor" stroke-width="2" fill="none"/>
       <path d="M5 21V7l8-4v18" stroke="currentColor" stroke-width="2" fill="none"/>
       <path d="M19 9v12" stroke="currentColor" stroke-width="2" fill="none"/>
       <path d="M9 9v6" stroke="currentColor" stroke-width="2" fill="none"/>
       <path d="M15 9v6" stroke="currentColor" stroke-width="2" fill="none"/>`; // Building2 icon

  const svgIcon = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow-${type}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <circle cx="20" cy="20" r="18" fill="${color}" filter="url(#shadow-${type})" stroke="white" stroke-width="2"/>
      <circle cx="20" cy="20" r="13" fill="white" opacity="0.95"/>
      <g transform="translate(8, 8) scale(1)" stroke="${color}" stroke-width="2" fill="none">
        ${iconSvg}
      </g>
    </svg>
  `;
  
  return new L.Icon({
    iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgIcon)}`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

// Componente para ajustar la vista del mapa automáticamente
function MapBounds({ properties, L }: { properties: Property[], L: any }) {
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    if (!map || !L || properties.length === 0) return;

    const propertiesWithCoords = properties.filter(p => p.latitude && p.longitude);
    
    if (propertiesWithCoords.length === 0) {
      // Si no hay propiedades con coordenadas, centrar en Tucumán
      map.setView([-26.8083, -65.2176], 12);
      return;
    }

    if (propertiesWithCoords.length === 1) {
      // Si hay solo una propiedad, centrar en ella
      const property = propertiesWithCoords[0];
      map.setView([property.latitude!, property.longitude!], 15);
      return;
    }

    // Si hay múltiples propiedades, ajustar la vista para mostrar todas
    const bounds = L.latLngBounds(
      propertiesWithCoords.map(property => [property.latitude!, property.longitude!])
    );
    
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [map, properties, L]);

  // Hook para obtener referencia del mapa
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Buscar instancia del mapa en el DOM después de que se monte
      const checkForMap = () => {
        const mapContainer = document.querySelector('.leaflet-container');
        if (mapContainer && (mapContainer as any)._leaflet_map) {
          setMap((mapContainer as any)._leaflet_map);
        } else {
          setTimeout(checkForMap, 100);
        }
      };
      
      setTimeout(checkForMap, 100);
    }
  }, []);

  return null;
}

// Componente para el popup de múltiples propiedades
function MultiplePropertiesPopup({ properties }: { properties: Property[] }) {
  const router = useRouter();

  const formatLocation = (address: string, neighborhood?: string) => {
    if (address && neighborhood) {
      return `${neighborhood} - ${address}`;
    }
    return neighborhood || address || 'Ubicación no especificada';
  };

  return (
    <div className="w-72 p-2">
      <div className="text-center mb-3">
        <h3 className="font-bold text-gray-900 text-sm">
          {properties.length} propiedades en esta ubicación
        </h3>
        <p className="text-xs text-gray-600">
          {formatLocation(properties[0].address, properties[0].neighborhood)}
        </p>
      </div>
      
      <div className="max-h-80 overflow-y-auto space-y-3">
        {properties.map((property, index) => (
          <div key={property.id} className="border-b border-gray-200 last:border-b-0 pb-3 last:pb-0">
            <div className="flex gap-2">
              {/* Imagen pequeña */}
              <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                <img
                  src={property.images.length > 0 ? property.images[0] : '/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png';
                  }}
                />
              </div>
              
              {/* Información */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-xs text-gray-900 line-clamp-1 mb-1">
                  {property.title}{property.is_monoambiente ? ' (Monoambiente)' : ''}
                </h4>
                
                <div className="flex items-center gap-1 mb-1">
                  <Badge 
                    variant={property.operation_type === 'venta' ? 'default' : 'secondary'}
                    className={`text-xs ${
                      property.operation_type === 'venta' 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                  >
                    {property.operation_type === 'venta' ? 'Venta' : 'Alquiler'}
                  </Badge>
                </div>

                <div className="text-sm font-bold text-[#ff8425] mb-1">
                  {formatPrice(property.price, property.currency)}
                </div>

                {/* Características básicas */}
                {property.property_type !== 'terreno' && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <Bed className="w-3 h-3" />
                        <span>{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <Bath className="w-3 h-3" />
                        <span>{property.bathrooms}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Square className="w-3 h-3" />
                      <span>{getPropertyArea(property.property_type, property.construccion, property.terreno)}</span>
                    </div>
                  </div>
                )}

                {/* Badge para monoambiente */}
                {property.is_monoambiente && (
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-300">
                      Monoambiente
                    </Badge>
                  </div>
                )}

                <Button
                  onClick={() => router.push(`/propiedades/${property.id}`)}
                  className="w-full bg-[#ff8425] hover:bg-[#e6741f] text-white text-xs py-1 h-7"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Ver detalles
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente para el contenido del popup
function PropertyPopup({ property }: { property: Property }) {
  const router = useRouter();

  const handleViewProperty = () => {
    router.push(`/propiedades/${property.id}`);
  };

  const formatLocation = (address: string, neighborhood?: string) => {
    if (address && neighborhood) {
      return `${neighborhood} - ${address}`;
    }
    return neighborhood || address || 'Ubicación no especificada';
  };

  return (
    <div className="w-64 p-2">
      {/* Imagen de la propiedad */}
      {property.images.length > 0 && (
        <div className="mb-3 relative h-32 w-full rounded-lg overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png';
            }}
          />
          <div className="absolute top-2 left-2 flex gap-1">
            <Badge 
              variant={property.operation_type === 'venta' ? 'default' : 'secondary'}
              className={`text-xs ${
                property.operation_type === 'venta' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {property.operation_type === 'venta' ? 'Venta' : 'Alquiler'}
            </Badge>
          </div>
        </div>
      )}

      {/* Información de la propiedad */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
          {property.title}{property.is_monoambiente ? ' (Monoambiente)' : ''}
        </h3>
        
        <div className="flex items-center text-gray-600 text-xs">
          <MapPin className="w-3 h-3 mr-1" />
          <span className="line-clamp-1">
            {formatLocation(property.address, property.neighborhood)}
          </span>
        </div>

        <div className="text-lg font-bold text-[#ff8425]">
          {formatPrice(property.price, property.currency)}
        </div>

        {/* Características específicas por tipo de propiedad */}
        {property.property_type === 'terreno' ? (
          <div className="flex flex-wrap gap-1 text-xs">
            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
              <Shield className="w-3 h-3" />
              <span>{property.barrio_cerrado ? 'B. Cerrado' : 'No B.C.'}</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
              <TreePine className="w-3 h-3" />
              <span>{property.es_country ? 'Country' : 'No Country'}</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
              <DollarSign className="w-3 h-3" />
              <span>{property.paga_expensas ? 'C/Exp' : 'S/Exp'}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-xs text-gray-600">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="w-3 h-3" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="w-3 h-3" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Square className="w-3 h-3" />
              <span>{getPropertyArea(property.property_type, property.construccion, property.terreno)}</span>
            </div>
          </div>
        )}

        {/* Badge para monoambiente */}
        {property.is_monoambiente && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-300">
              Monoambiente
            </Badge>
          </div>
        )}

        <div className="pt-2">
          <Button
            onClick={handleViewProperty}
            className="w-full bg-[#ff8425] hover:bg-[#e6741f] text-white text-xs py-2"
          >
            <Eye className="w-3 h-3 mr-1" />
            Ver detalles
          </Button>
        </div>
      </div>
    </div>
  );
}

interface InteractiveMapProps {
  properties: Property[];
  height?: string;
  showControls?: boolean;
  className?: string;
}

const InteractiveMap = ({ 
  properties, 
  height = "500px", 
  showControls = true,
  className = ""
}: InteractiveMapProps) => {
  const [isClient, setIsClient] = useState(false);
  const L = useLeaflet();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filtrar propiedades que tienen coordenadas válidas
  const propertiesWithCoords = useMemo(() => {
    return properties.filter(property => 
      property.latitude && 
      property.longitude && 
      property.status === 'disponible' &&
      !isNaN(property.latitude) && 
      !isNaN(property.longitude) &&
      property.latitude >= -90 && property.latitude <= 90 &&
      property.longitude >= -180 && property.longitude <= 180
    );
  }, [properties]);

  // Agrupar propiedades por ubicación
  const propertyGroups = useMemo(() => {
    return groupPropertiesByLocation(propertiesWithCoords);
  }, [propertiesWithCoords]);

  // Estadísticas para mostrar
  const stats = useMemo(() => {
    const ventas = propertiesWithCoords.filter(p => p.operation_type === 'venta').length;
    const alquileres = propertiesWithCoords.filter(p => p.operation_type === 'alquiler').length;
    const destacadas = propertiesWithCoords.filter(p => p.featured).length;
    
    return { ventas, alquileres, destacadas, total: propertiesWithCoords.length };
  }, [propertiesWithCoords]);

  // No renderizar en el servidor o si Leaflet no está cargado
  if (!isClient || !L) {
    return (
      <div 
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} 
        style={{ height }}
      >
        <div className="text-center">
          <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden shadow-lg ${className}`}>
      {/* Controles y estadísticas */}
      {showControls && (
        <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-md">
          <div className="text-sm font-semibold text-gray-900 mb-2">
            Propiedades en el mapa
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Ventas: {stats.ventas}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Alquileres: {stats.alquileres}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Destacadas: {stats.destacadas}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#ff8425] rounded-full"></div>
              <span>Marcadores: {propertyGroups.length}</span>
            </div>
            <div className="pt-1 border-t border-gray-200">
              <span className="font-medium">Total: {stats.total}</span>
            </div>
          </div>
        </div>
      )}

      {/* Mapa */}
      <MapContainer
        center={[-26.8083, -65.2176]} // Centro en Tucumán
        zoom={12}
        style={{ height, width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Ajustar vista automáticamente */}
        <MapBounds properties={propertiesWithCoords} L={L} />

        {/* Marcadores de propiedades agrupadas */}
        {propertyGroups.map((group) => {
          const hasVentas = group.properties.some(p => p.operation_type === 'venta');
          const hasAlquileres = group.properties.some(p => p.operation_type === 'alquiler');
          
          // Determinar color y tipo según las propiedades del grupo
          let color = '#ff8425'; // Color por defecto (mixto)
          let type: 'venta' | 'alquiler' = 'venta';
          
          if (hasVentas && !hasAlquileres) {
            color = '#10b981'; // Verde para solo ventas
            type = 'venta';
          } else if (hasAlquileres && !hasVentas) {
            color = '#3b82f6'; // Azul para solo alquileres
            type = 'alquiler';
          } else if (hasVentas && hasAlquileres) {
            color = '#ff8425'; // Naranja para mixto
            type = 'venta'; // Usar venta como base para el icono
          }

          return (
            <Marker
              key={group.id}
              position={[group.latitude, group.longitude]}
              icon={createIcon(L, color, type, group.properties.length)}
            >
              <Popup
                maxWidth={group.properties.length > 1 ? 320 : 280}
                className="property-popup"
              >
                {group.properties.length > 1 ? (
                  <MultiplePropertiesPopup properties={group.properties} />
                ) : (
                  <PropertyPopup property={group.properties[0]} />
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Mensaje si no hay propiedades con coordenadas */}
      {propertyGroups.length === 0 && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-[1000]">
          <div className="text-center p-4">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay propiedades para mostrar
            </h3>
            <p className="text-gray-600 text-sm">
              Las propiedades aparecerán en el mapa cuando tengan coordenadas configuradas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap; 