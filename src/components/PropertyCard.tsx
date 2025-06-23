'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Bed, Bath, Square, Shield, TreePine, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { formatPropertyType } from '@/lib/utils';
import { usePropertyImageAlt } from '@/components/SEOHead';
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
  images,
  barrio_cerrado,
  es_country,
  paga_expensas
}: PropertyCardProps) => {
  const router = useRouter();
  
  // Generar alt text optimizado para SEO
  const imageAlt = usePropertyImageAlt(
    formatPropertyType(propertyType), 
    type, 
    location
  );

  const handleViewDetails = () => {
    router.push(`/propiedades/${id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
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
        <div className="absolute top-3 left-3">
          <Badge 
            variant={type === 'venta' ? 'default' : 'secondary'}
            className={`${type === 'venta' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            {type === 'venta' ? 'Venta' : 'Alquiler'}
          </Badge>
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
            <span className="text-sm">{location}</span>
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
            className="bg-[#ff8425] hover:bg-[#e6741f]"
            style={{ color: '#ffffff' }}
            onClick={handleViewDetails}
          >
            Ver detalles
          </Button>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
};

export default PropertyCard;