'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Bed, Bath, Square, Shield, TreePine, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { formatPropertyType } from '@/lib/utils';
import { usePropertyImageAlt } from '@/components/SEOHead';
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';

// Función helper para limpiar la ubicación
const cleanLocation = (location: string): string => {
  return location.trim().replace(/,\s*$/, '');
};

interface PropertyCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
  type: 'venta' | 'alquiler';
  propertyType: string;
  // Agregamos la prop status para manejar el estado reservado
  status?: 'disponible' | 'vendido' | 'alquilado' | 'reservado';
  // Propiedades adicionales para compatibilidad
  description?: string;
  yearBuilt?: number;
  garage?: boolean;
  garden?: boolean;
  pool?: boolean;
  security?: boolean;
  gym?: boolean;
  wifi?: boolean;
  furnished?: boolean;
  pets?: boolean;
  features?: string[];
  address?: string;
  neighborhood?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  images?: string[];
  // Campos específicos para terrenos
  barrio_cerrado?: boolean;
  es_country?: boolean;
  paga_expensas?: boolean;
  // Campos específicos para estacionamientos
  cubierto?: boolean;
  capacidad?: number;
}

const PropertyCard = ({ 
  id, 
  title, 
  price, 
  location, 
  bedrooms, 
  bathrooms, 
  area, 
  image, 
  type, 
  propertyType,
  status = 'disponible',
  images,
  barrio_cerrado,
  es_country,
  paga_expensas,
  cubierto,
  capacidad
}: PropertyCardProps) => {
  const router = useRouter();
  const { trackPropertyView, trackEvent } = useGoogleAnalytics();
  
  // Determinar si la propiedad está reservada
  const isReserved = status === 'reservado';
  
  // Generar alt text optimizado para SEO
  const imageAlt = usePropertyImageAlt(
    formatPropertyType(propertyType), 
    type, 
    location
  );

  // Parsear el precio para obtener el valor numérico (opcional para analytics)
  const parsePrice = (priceStr: string): number | undefined => {
    const numericPrice = priceStr.replace(/[^\d]/g, '');
    return numericPrice ? parseInt(numericPrice) : undefined;
  };

  const handleViewDetails = () => {
    // Trackear el clic en "Ver detalles"
    trackPropertyView(id, propertyType, parsePrice(price));
    
    // Trackear evento adicional de navegación
    trackEvent({
      action: 'property_card_click',
      category: 'Property Interaction',
      label: `${propertyType}_${type}`,
      custom_parameters: {
        property_id: id,
        property_type: propertyType,
        transaction_type: type,
        location: location,
        price_range: parsePrice(price) ? 
          parsePrice(price)! > 100000 ? 'high' : 
          parsePrice(price)! > 50000 ? 'medium' : 'low' : 'unknown'
      }
    });

    router.push(`/propiedades/${id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={isReserved ? 'filter grayscale opacity-80' : ''}
    >
      <Card className="group overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="relative overflow-hidden">
          <motion.img 
            src={image} 
            alt={imageAlt}
            className="w-full h-48 object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            loading="lazy"
          />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge 
            variant={type === 'venta' ? 'default' : 'secondary'}
            className={`${type === 'venta' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            {type === 'venta' ? 'Venta' : 'Alquiler'}
          </Badge>
          {isReserved && (
            <Badge 
              variant="destructive"
              className="bg-red-500 hover:bg-red-600 text-white font-bold animate-pulse"
            >
              RESERVADO
            </Badge>
          )}
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge variant="outline" className="bg-white/90 text-gray-900 border-gray-300">
            {formatPropertyType(propertyType)}
          </Badge>
        </div>
        {/* Indicador de múltiples imágenes */}
        {images && images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            +{images.length - 1} fotos
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-5 h-5 mr-2 text-gray-500" />
            <span className="text-sm">{cleanLocation(location)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 text-gray-700">
          {propertyType === 'terreno' ? (
            // Características específicas para terrenos
            <>
              <div className="flex items-center space-x-1">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="text-xs font-medium">{barrio_cerrado ? 'B. Cerrado' : 'No B.C.'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <TreePine className="w-5 h-5 text-gray-500" />
                <span className="text-xs font-medium">{es_country ? 'Country' : 'No Country'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <span className="text-xs font-medium">{paga_expensas ? 'C/Expensas' : 'S/Expensas'}</span>
              </div>
            </>
          ) : propertyType === 'local' ? (
            // Características específicas para locales
            <>
              <div className="flex items-center space-x-1">
                <Square className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">{area}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <span className="text-xs font-medium">{paga_expensas ? 'C/Expensas' : 'S/Expensas'}</span>
              </div>
            </>
          ) : propertyType === 'oficina' ? (
            // Características específicas para oficinas
            <>
              <div className="flex items-center space-x-1">
                <Square className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">{area}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">{bathrooms}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <span className="text-xs font-medium">{paga_expensas ? 'C/Expensas' : 'S/Expensas'}</span>
              </div>
            </>
          ) : propertyType === 'casa' ? (
            // Características específicas para casas
            <>
              <div className="flex items-center space-x-1">
                <Bed className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">{bedrooms}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">{bathrooms}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Square className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">{area}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <span className="text-xs font-medium">{paga_expensas ? 'C/Exp' : 'S/Exp'}</span>
              </div>
            </>
          ) : propertyType === 'apartamento' ? (
            // Características específicas para departamentos
            <>
              <div className="flex items-center space-x-1">
                <Bed className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">{bedrooms}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">{bathrooms}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Square className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">{area}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <span className="text-xs font-medium">{paga_expensas ? 'C/Exp' : 'S/Exp'}</span>
              </div>
            </>
          ) : propertyType === 'estacionamiento' ? (
            // Características específicas para estacionamientos
            <>
              <div className="flex items-center space-x-1">
                <Square className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">{area}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-xs font-medium">{cubierto ? 'Cubierto' : 'Descubierto'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 6h8l2 2v6a2 2 0 01-2 2h-1m-4 0H7m4 0V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h4z" />
                </svg>
                <span className="text-xs font-medium">{capacidad || 1} auto{(capacidad || 1) > 1 ? 's' : ''}</span>
              </div>
            </>
          ) : (
            // Características tradicionales para otros tipos de propiedades
            <>
              <div className="flex items-center space-x-1">
                <Bed className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">{bedrooms}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">{bathrooms}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Square className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">{area}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="bg-[#ff8425] px-4 py-2 rounded-lg shadow-md" style={{ color: '#ffffff' }}>
            <div className="text-lg font-bold leading-tight" style={{ color: '#ffffff' }}>
              {price}
            </div>
          </div>
          <Button 
            size="sm" 
            className={isReserved 
              ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed" 
              : "bg-[#ff8425] hover:bg-[#e6741f]"
            }
            style={{ color: '#ffffff' }}
            onClick={isReserved ? undefined : handleViewDetails}
            disabled={isReserved}
          >
            {isReserved ? 'Reservado' : 'Ver detalles'}
          </Button>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
};

export default PropertyCard;