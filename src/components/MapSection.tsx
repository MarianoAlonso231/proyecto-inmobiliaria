'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import InteractiveMap from './InteractiveMap';
import { useProperties } from '@/hooks/useProperties';

const MapSection = () => {
  const { properties, isLoading } = useProperties();
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
        ease: [0.25, 0.25, 0.25, 0.75]
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

  // Estadísticas rápidas de las propiedades
  const stats = {
    total: properties.length,
    conCoordenadas: properties.filter(p => p.latitude && p.longitude).length,
    ventas: properties.filter(p => p.operation_type === 'venta').length,
    alquileres: properties.filter(p => p.operation_type === 'alquiler').length,
  };

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header de la sección */}
        <motion.div 
          className="text-center mb-12"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-[#ff8425] rounded-full mb-6"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <MapPin className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Explora propiedades en el mapa
          </motion.h2>
          
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Descubre la ubicación exacta de todas nuestras propiedades disponibles. 
            Haz clic en los marcadores para ver más detalles.
          </motion.p>
        </motion.div>

        {/* Estadísticas rápidas */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#ff8425] mb-1">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600">
                  Total propiedades
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {stats.ventas}
                </div>
                <div className="text-sm text-gray-600">
                  En venta
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {stats.alquileres}
                </div>
                <div className="text-sm text-gray-600">
                  En alquiler
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {stats.conCoordenadas}
                </div>
                <div className="text-sm text-gray-600">
                  En el mapa
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Mapa interactivo */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-8"
        >
          <Card className="bg-white border-gray-200 overflow-hidden">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="h-[500px] flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-[#ff8425] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando propiedades...</p>
                  </div>
                </div>
              ) : (
                <InteractiveMap 
                  properties={properties} 
                  height="500px"
                  showControls={false}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>



        {/* Nota informativa */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <p className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm rounded-lg p-3 inline-block">
            💡 <strong>Consejo:</strong> Haz clic en los marcadores para ver detalles. Los marcadores verdes son ventas, 
            azules alquileres, y naranjas ubicaciones con múltiples propiedades. Los números indican cuántas propiedades hay en cada lugar.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default MapSection; 