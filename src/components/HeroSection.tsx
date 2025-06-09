'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const HeroSection = () => {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    tipo: 'cualquier_tipo',
    operacion: 'cualquier_operacion',
    dormitorios: 'cualquier_dormitorio',
    barrio: 'cualquier_barrio'
  });

  const handleSearch = () => {
    // Construir parámetros de búsqueda para la URL
    const params = new URLSearchParams();

    // Solo agregar parámetros que no sean "cualquier" o valores por defecto
    if (searchParams.tipo !== 'cualquier_tipo') {
      params.set('tipo', searchParams.tipo);
    }
    if (searchParams.dormitorios !== 'cualquier_dormitorio') {
      params.set('dormitorios', searchParams.dormitorios);
    }
    if (searchParams.barrio !== 'cualquier_barrio') {
      params.set('barrio', searchParams.barrio);
    }

    // Determinar la página de destino basado en la operación
    let targetPage = '/propiedades'; // Página general por defecto
    
    if (searchParams.operacion === 'alquiler') {
      targetPage = '/alquileres';
    } else if (searchParams.operacion === 'venta') {
      targetPage = '/ventas';
    } else if (searchParams.operacion === 'cualquier_operacion') {
      // Si es cualquier operación, ir a página general de propiedades
      targetPage = '/propiedades';
    }

    // Construir la URL final con parámetros
    const finalUrl = params.toString() ? `${targetPage}?${params.toString()}` : targetPage;
    
    // Redirigir a la página correspondiente
    router.push(finalUrl);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat flex items-center" style={{ backgroundImage: 'url(/imagen-hero-section.jpg)' }}>
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Background Pattern - opcional, se puede eliminar si interfiere con la imagen */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-xl"></div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-8 drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Encuentra tu
            <motion.span 
              className="text-[#ff8425] block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            >
              propiedad ideal
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-2xl text-white max-w-3xl mx-auto drop-shadow-md leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            Descubre las mejores oportunidades inmobiliarias en tu zona preferida
          </motion.p>
        </motion.div>

        {/* Search Form */}
        <motion.div 
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
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
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="oficina">Oficina</SelectItem>
                  <SelectItem value="local">Local Comercial</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Button 
              onClick={handleSearch}
              className="w-full md:w-auto bg-[#ff8425] hover:bg-[#e6741f] text-white px-8 py-3 text-lg font-semibold hover:scale-105 transform transition-transform duration-200"
            >
              <Search className="w-5 h-5 mr-2" />
              Buscar propiedades
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;