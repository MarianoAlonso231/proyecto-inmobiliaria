'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Search, 
  Home,
  Building,
  Car,
  Store,
  Mountain,
  RotateCcw,
  Filter,
  Eye,
  Navigation
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InteractiveMap from '@/components/InteractiveMap';
import { useProperties, Property } from '@/hooks/useProperties';
import { formatPrice } from '@/lib/utils';


const MapaPage = () => {
  const { properties, isLoading } = useProperties();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Hook para detectar tamaño de pantalla
  const [mapHeight, setMapHeight] = useState("600px");
  
  useEffect(() => {
    const updateMapHeight = () => {
      if (window.innerWidth < 768) {
        setMapHeight("450px");
      } else {
        setMapHeight("600px");
      }
    };
    
    updateMapHeight();
    window.addEventListener('resize', updateMapHeight);
    return () => window.removeEventListener('resize', updateMapHeight);
  }, []);

  // Estados para filtros (usando la misma estructura que HeroSection)
  const [searchParams, setSearchParams] = useState({
    tipo: 'cualquier_tipo',
    operacion: 'cualquier_operacion',
    dormitorios: 'cualquier_dormitorio',
    barrio: 'cualquier_barrio'
  });

  // Aplicar filtros cuando cambien las propiedades o los filtros
  useEffect(() => {
    let filtered = properties.filter(property => 
      property.latitude && 
      property.longitude && 
      (property.status === 'disponible' || property.status === 'reservado' || property.status === 'vendido' || property.status === 'alquilado')
    );

    // Filtro por operación
    if (searchParams.operacion && searchParams.operacion !== 'cualquier_operacion') {
      filtered = filtered.filter(p => p.operation_type === searchParams.operacion);
    }

    // Filtro por tipo de propiedad
    if (searchParams.tipo && searchParams.tipo !== 'cualquier_tipo') {
      filtered = filtered.filter(p => p.property_type === searchParams.tipo);
    }

    // Filtro por dormitorios
    if (searchParams.dormitorios && searchParams.dormitorios !== 'cualquier_dormitorio') {
      if (searchParams.dormitorios === 'monoambiente') {
        filtered = filtered.filter(p => p.is_monoambiente === true);
      } else if (searchParams.dormitorios === '4') {
        filtered = filtered.filter(p => p.bedrooms >= 4);
      } else {
        filtered = filtered.filter(p => p.bedrooms === parseInt(searchParams.dormitorios));
      }
    }

    // Filtro por barrio (simplificado para coincidir con HeroSection)
    if (searchParams.barrio && searchParams.barrio !== 'cualquier_barrio') {
      const barrioMap: Record<string, string[]> = {
        'centro': ['centro', 'centro histórico', 'microcentro'],
        'norte': ['norte', 'zona norte', 'yerba buena', 'el manantial'],
        'sur': ['sur', 'zona sur', 'los nogales'],
        'este': ['este', 'zona este', 'bella vista'],
        'oeste': ['oeste', 'zona oeste', 'san jorge']
      };

      const barriosToSearch = barrioMap[searchParams.barrio] || [searchParams.barrio];
      filtered = filtered.filter(p => 
        barriosToSearch.some(barrio => 
          p.neighborhood?.toLowerCase().includes(barrio.toLowerCase()) ||
          p.address?.toLowerCase().includes(barrio.toLowerCase())
        )
      );
    }

    setFilteredProperties(filtered);
  }, [properties, searchParams]);

  // Limpiar filtros
  const clearFilters = () => {
    setSearchParams({
      tipo: 'cualquier_tipo',
      operacion: 'cualquier_operacion',
      dormitorios: 'cualquier_dormitorio',
      barrio: 'cualquier_barrio'
    });
  };

  // Función para aplicar filtros manualmente (para el botón)
  const applyFilters = () => {
    // Los filtros se aplican automáticamente a través del useEffect
    console.log('Filtros aplicados');
  };



  // Obtener iconos para tipos de propiedad
  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'casa': return Home;
      case 'apartamento': return Building;
      case 'oficina': return Building;
      case 'local': return Store;
      case 'terreno': return Mountain;
      case 'estacionamiento': return Car;
      default: return Home;
    }
  };

  // Estadísticas de las propiedades filtradas (solo las 3 que necesitamos)
  const stats = {
    total: filteredProperties.length,
    ventas: filteredProperties.filter(p => p.operation_type === 'venta').length,
    alquileres: filteredProperties.filter(p => p.operation_type === 'alquiler').length
  };

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
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">

      <Header />

      {/* Contenido Principal - Hero section simple como en alquileres */}
      <section ref={ref} className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header animado - mismo estilo que alquileres */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Mapa de Propiedades
            </h1>
            <p className="text-lg text-gray-600">
              Descubre la ubicación exacta de todas nuestras propiedades disponibles. 
              Filtra y encuentra tu propiedad ideal con facilidad.
            </p>
          </motion.div>
          
          {/* Panel de Filtros - Mismo diseño que HeroSection */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mb-8"
          >
            <Card className="bg-white/95 backdrop-blur-sm border-gray-200 shadow-xl">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de propiedad
                    </label>
                    <Select value={searchParams.tipo} onValueChange={(value) => setSearchParams({...searchParams, tipo: value})}>
                      <SelectTrigger className="w-full bg-white border-gray-200 text-gray-900">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="cualquier_tipo">Cualquier tipo</SelectItem>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="apartamento">Departamento</SelectItem>
                        <SelectItem value="oficina">Oficina</SelectItem>
                        <SelectItem value="local">Local Comercial</SelectItem>
                        <SelectItem value="terreno">Terreno</SelectItem>
                        <SelectItem value="estacionamiento">Estacionamiento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Operación
                    </label>
                    <Select value={searchParams.operacion} onValueChange={(value) => setSearchParams({...searchParams, operacion: value})}>
                      <SelectTrigger className="w-full bg-white border-gray-200 text-gray-900">
                        <SelectValue placeholder="Operación" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="cualquier_operacion">Cualquier operación</SelectItem>
                        <SelectItem value="venta">Venta</SelectItem>
                        <SelectItem value="alquiler">Alquiler</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dormitorios
                    </label>
                    <Select value={searchParams.dormitorios} onValueChange={(value) => setSearchParams({...searchParams, dormitorios: value})}>
                      <SelectTrigger className="w-full bg-white border-gray-200 text-gray-900">
                        <SelectValue placeholder="Dormitorios" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="cualquier_dormitorio">Cualquier cantidad</SelectItem>
                        <SelectItem value="monoambiente">Monoambiente</SelectItem>
                        <SelectItem value="1">1 dormitorio</SelectItem>
                        <SelectItem value="2">2 dormitorios</SelectItem>
                        <SelectItem value="3">3 dormitorios</SelectItem>
                        <SelectItem value="4">4+ dormitorios</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Barrio
                    </label>
                    <Select value={searchParams.barrio} onValueChange={(value) => setSearchParams({...searchParams, barrio: value})}>
                      <SelectTrigger className="w-full bg-white border-gray-200 text-gray-900">
                        <SelectValue placeholder="Barrio" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="cualquier_barrio">Cualquier barrio</SelectItem>
                        <SelectItem value="centro">Centro</SelectItem>
                        <SelectItem value="norte">Zona Norte</SelectItem>
                        <SelectItem value="sur">Zona Sur</SelectItem>
                        <SelectItem value="este">Zona Este</SelectItem>
                        <SelectItem value="oeste">Zona Oeste</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Limpiar filtros
                  </Button>

                  <Button
                    onClick={applyFilters}
                    className="bg-[#ff8425] hover:bg-[#e6741f] text-white flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Aplicar filtros
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Estadísticas - Solo 3 cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-white border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-[#ff8425] mb-1">
                    {stats.total}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total en mapa
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white border-gray-200">
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
              <Card className="bg-white border-gray-200">
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
          </motion.div>

          {/* Mapa Principal */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mb-8"
          >
            <Card className="bg-white border-gray-200 overflow-hidden">
              <CardContent className="p-0">
                {isLoading ? (
                  <div style={{ height: mapHeight }} className="flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-[#ff8425] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Cargando propiedades en el mapa...</p>
                    </div>
                  </div>
                ) : (
                  <InteractiveMap 
                    properties={filteredProperties} 
                    height={mapHeight}
                    showControls={false}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Guía de uso del mapa */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl">
              <CardContent className="p-8 relative overflow-hidden">
                {/* Efecto de brillo en hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                  initial={{ x: "-100%" }}
                  whileHover={{ 
                    x: "100%",
                    transition: { duration: 0.6, ease: "easeInOut" }
                  }}
                />
                
                <motion.h3 
                  className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  ¿Cómo usar el mapa de propiedades?
                </motion.h3>
                
                <motion.div 
                  className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                >
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ 
                      y: -12,
                      rotateY: 5,
                      transition: { duration: 0.3, ease: "easeOut" } 
                    }}
                    className="text-center group/item relative z-10"
                  >
                    <motion.div 
                      className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative"
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.15,
                        boxShadow: "0 10px 30px rgba(34, 197, 94, 0.4)"
                      }}
                      transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Home className="w-8 h-8 text-white" />
                      </motion.div>
                    </motion.div>
                 
                 <motion.h4 
                   className="font-semibold text-gray-900 mb-3"
                   whileHover={{ scale: 1.05 }}
                   transition={{ duration: 0.2 }}
                 >
                   Marcadores Verdes
                 </motion.h4>
                 
                 <motion.p 
                   className="text-sm text-gray-600 leading-relaxed"
                   initial={{ opacity: 0.8 }}
                   whileHover={{ opacity: 1 }}
                   transition={{ duration: 0.2 }}
                 >
                   Propiedades disponibles solo para venta
                 </motion.p>
                  </motion.div>

                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ 
                      y: -12,
                      rotateY: 5,
                      transition: { duration: 0.3, ease: "easeOut" } 
                    }}
                    className="text-center group/item relative z-10"
                  >
                    <motion.div 
                      className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative"
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.15,
                        boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)"
                      }}
                      transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Building className="w-8 h-8 text-white" />
                      </motion.div>
                    </motion.div>
                 
                 <motion.h4 
                   className="font-semibold text-gray-900 mb-3"
                   whileHover={{ scale: 1.05 }}
                   transition={{ duration: 0.2 }}
                 >
                   Marcadores Azules
                 </motion.h4>
                 
                 <motion.p 
                   className="text-sm text-gray-600 leading-relaxed"
                   initial={{ opacity: 0.8 }}
                   whileHover={{ opacity: 1 }}
                   transition={{ duration: 0.2 }}
                 >
                   Propiedades disponibles solo para alquiler
                 </motion.p>
                  </motion.div>

                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ 
                      y: -12,
                      rotateY: 5,
                      transition: { duration: 0.3, ease: "easeOut" } 
                    }}
                    className="text-center group/item relative z-10"
                  >
                    <motion.div 
                      className="bg-[#ff8425] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative"
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.15,
                        boxShadow: "0 10px 30px rgba(255, 132, 37, 0.4)"
                      }}
                      transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Home className="w-8 h-8 text-white" />
                      </motion.div>
                      <motion.div 
                        className="absolute -top-1 -right-1 bg-white text-[#ff8425] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8, type: "spring" }}
                      >
                        2
                      </motion.div>
                    </motion.div>
                 
                 <motion.h4 
                   className="font-semibold text-gray-900 mb-3"
                   whileHover={{ scale: 1.05 }}
                   transition={{ duration: 0.2 }}
                 >
                   Marcadores Naranjas
                 </motion.h4>
                 
                 <motion.p 
                   className="text-sm text-gray-600 leading-relaxed"
                   initial={{ opacity: 0.8 }}
                   whileHover={{ opacity: 1 }}
                   transition={{ duration: 0.2 }}
                 >
                   Ubicaciones mixtas (ventas y alquileres) disponibles
                 </motion.p>
                  </motion.div>

                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ 
                      y: -12,
                      rotateY: 5,
                      transition: { duration: 0.3, ease: "easeOut" } 
                    }}
                    className="text-center group/item relative z-10"
                  >
                    <motion.div 
                      className="bg-gray-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative"
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.15,
                        boxShadow: "0 10px 30px rgba(107, 114, 128, 0.4)"
                      }}
                      transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Home className="w-8 h-8 text-white opacity-70" />
                      </motion.div>
                    </motion.div>
                 
                 <motion.h4 
                   className="font-semibold text-gray-900 mb-3"
                   whileHover={{ scale: 1.05 }}
                   transition={{ duration: 0.2 }}
                 >
                   Marcadores Grises
                 </motion.h4>
                 
                 <motion.p 
                   className="text-sm text-gray-600 leading-relaxed"
                   initial={{ opacity: 0.8 }}
                   whileHover={{ opacity: 1 }}
                   transition={{ duration: 0.2 }}
                 >
                   Propiedades no disponibles (vendidas, reservadas o alquiladas)
                 </motion.p>
                  </motion.div>

                </motion.div>
              </CardContent>
            </Card>
          </motion.div>         
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MapaPage; 