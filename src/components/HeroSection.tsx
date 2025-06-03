'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const HeroSection = () => {
  const [searchParams, setSearchParams] = useState({
    tipo: 'cualquier_tipo',
    operacion: 'cualquier_operacion',
    dormitorios: 'cualquier_dormitorio',
    barrio: 'cualquier_barrio'
  });

  const handleSearch = () => {
    console.log('Buscando con parámetros:', searchParams);
    // Aquí implementarías la lógica de búsqueda
  };

  return (
    <section className="relative bg-gradient-to-br from-primary-100 to-primary-200 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-400 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-primary-300 rounded-full blur-xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 animate-fade-in">
            Encuentra tu
            <span className="text-primary-400 block">propiedad ideal</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre las mejores oportunidades inmobiliarias en tu zona preferida
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-5xl mx-auto">
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

          <Button 
            onClick={handleSearch}
            className="w-full md:w-auto bg-primary-400 hover:bg-primary-500 text-white px-8 py-3 text-lg font-semibold"
          >
            <Search className="w-5 h-5 mr-2" />
            Buscar propiedades
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;