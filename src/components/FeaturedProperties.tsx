'use client';

import { useFeaturedProperties } from '@/hooks/useProperties';
import PropertyCard from './PropertyCard';
import { Loader2, Home, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

const FeaturedProperties = () => {
  const { featuredProperties, isLoading, error } = useFeaturedProperties(6);
  const router = useRouter();

  // Función para formatear la ubicación
  const formatLocation = (address: string, neighborhood: string) => {
    if (address && neighborhood) {
      return `${neighborhood} - ${address}`;
    }
    return neighborhood || address || 'Ubicación no especificada';
  };

  // Función para formatear el área
  const formatArea = (area: number | null) => {
    return area ? `${area}m²` : 'N/A';
  };



  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
              <p className="text-red-600">Error al cargar las propiedades destacadas</p>
              <p className="text-sm text-red-500 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Propiedades destacadas
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre las mejores oportunidades inmobiliarias seleccionadas especialmente para ti
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#ff8425]" />
              <p className="text-gray-600">Cargando propiedades destacadas...</p>
            </div>
          </div>
        ) : featuredProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-8 bg-white rounded-lg shadow-sm border border-gray-200 max-w-md mx-auto">
              <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                <Home className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay propiedades destacadas
              </h3>
              <p className="text-gray-600 mb-4">
                Aún no se han marcado propiedades como destacadas. 
                Agrega propiedades desde el panel de administración.
              </p>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="inline-flex items-center gap-2 bg-[#ff8425] hover:bg-[#e6741f] text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Ir al panel de administración
              </button>
            </div>
          </div>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {featuredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.4 + (index * 0.1),
                    ease: "easeOut" 
                  }}
                >
                  <PropertyCard
                    id={property.id}
                    title={property.title}
                    price={formatPrice(property.price, property.currency)}
                    location={formatLocation(property.address, property.neighborhood)}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    area={formatArea(property.area_m2)}
                    image={property.images.length > 0 ? property.images[0] : '/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png'}
                    type={property.operation_type}
                    propertyType={property.property_type}
                    images={property.images.length > 0 ? property.images : ['/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png']}
                  />
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <button 
                onClick={() => router.push('/propiedades')}
                className="bg-[#ff8425] hover:bg-[#e6741f] text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 hover:scale-105 transform transition-transform duration-200"
              >
                Ver todas las propiedades
                <ExternalLink className="h-4 w-4" />
              </button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
