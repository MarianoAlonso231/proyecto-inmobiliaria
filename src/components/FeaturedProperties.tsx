'use client';

import { useFeaturedProperties } from '@/hooks/useProperties';
import PropertyCard from './PropertyCard';
import { Loader2, Home, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice, getPropertyArea } from '@/lib/utils';

const FeaturedProperties = () => {
  const { featuredProperties, isLoading, error } = useFeaturedProperties(6);
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0.25, 0.75] // Bezier curve para suavidad
      }
    }
  };

  const headerVariants = {
    hidden: { 
      opacity: 0, 
      y: -30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Función para formatear la ubicación
  const formatLocation = (address: string, neighborhood?: string) => {
    if (address && neighborhood) {
      return `${neighborhood} - ${address}`;
    }
    return neighborhood || address || 'Ubicación no especificada';
  };

  // Función para formatear el área (ya no necesaria, se usa getPropertyArea)
  // const formatArea = (area: number | null | undefined) => {
  //   return area ? `${area}m²` : 'N/A';
  // };



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
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Propiedades destacadas
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Descubre las mejores oportunidades inmobiliarias seleccionadas especialmente para ti
          </motion.p>
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
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {featuredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -8, 
                    transition: { duration: 0.3, ease: "easeOut" } 
                  }}
                >
                  <PropertyCard
                    id={property.id}
                    title={property.title}
                    price={formatPrice(property.price, property.currency)}
                    location={formatLocation(property.address, property.neighborhood)}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    area={getPropertyArea(property.property_type, property.construccion, property.terreno)}
                    image={property.images.length > 0 ? property.images[0] : '/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png'}
                    type={property.operation_type}
                    propertyType={property.property_type}
                    status={property.status}
                    images={property.images.length > 0 ? property.images : ['/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png']}
                    barrio_cerrado={property.barrio_cerrado}
                    es_country={property.es_country}
                    paga_expensas={property.paga_expensas}
                    cubierto={property.cubierto}
                    capacidad={property.capacidad}
                    is_monoambiente={property.is_monoambiente}
                  />
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isInView ? { 
                opacity: 1, 
                y: 0, 
                scale: 1 
              } : { 
                opacity: 0, 
                y: 30, 
                scale: 0.9 
              }}
              transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
            >
              <motion.button 
                onClick={() => router.push('/propiedades')}
                className="bg-[#ff8425] hover:bg-[#e6741f] px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                style={{ color: '#ffffff' }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(255, 132, 37, 0.3)",
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                  style={{ color: '#ffffff' }}
                >
                  Ver todas las propiedades
                </motion.span>
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  style={{ color: '#ffffff' }}
                >
                  <ExternalLink className="h-4 w-4" />
                </motion.div>
              </motion.button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
