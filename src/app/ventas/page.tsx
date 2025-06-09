'use client';
import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Bed, Bath, Square, Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useProperties, Property } from '@/hooks/useProperties';
import PropertyCard from '@/components/PropertyCard';
import { formatPrice } from '@/lib/utils';


function VentasContent() {
  const { properties: allProperties, isLoading, error } = useProperties();
  const searchParams = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState({
    tipo: 'todos',
    dormitorios: 'cualquiera',
    precioMin: '',
    precioMax: '',
    barrio: ''
  });



  // Filtrar solo propiedades en venta y disponibles
  const ventaProperties = allProperties.filter(property => 
    property.operation_type === 'venta' && property.status === 'disponible'
  );

  // Aplicar filtros desde URL cuando las propiedades se cargan
  useEffect(() => {
    if (allProperties.length > 0) {
      // Leer parámetros de la URL
      const urlTipo = searchParams.get('tipo');
      const urlDormitorios = searchParams.get('dormitorios');
      const urlBarrio = searchParams.get('barrio');

      // Actualizar estado de filtros con parámetros de URL
      const newFilters = {
        tipo: urlTipo || 'todos',
        dormitorios: urlDormitorios || 'cualquiera',
        precioMin: '',
        precioMax: '',
        barrio: urlBarrio || ''
      };

      setFilters(newFilters);

      // Aplicar filtros automáticamente
      applyFiltersWithParams(newFilters);
    } else {
      setFilteredProperties(ventaProperties);
    }
  }, [allProperties, searchParams]);

  const applyFiltersWithParams = (filtersToApply = filters) => {
    let filtered = ventaProperties.filter(property => {
      if (filtersToApply.tipo !== 'todos' && property.property_type !== filtersToApply.tipo) return false;
      if (filtersToApply.dormitorios !== 'cualquiera') {
        if (filtersToApply.dormitorios === '4' && property.bedrooms < 4) return false;
        if (filtersToApply.dormitorios !== '4' && property.bedrooms.toString() !== filtersToApply.dormitorios) return false;
      }
      if (filtersToApply.precioMin && property.price < parseInt(filtersToApply.precioMin)) return false;
      if (filtersToApply.precioMax && property.price > parseInt(filtersToApply.precioMax)) return false;
      if (filtersToApply.barrio && property.neighborhood && !property.neighborhood.toLowerCase().includes(filtersToApply.barrio.toLowerCase())) return false;
      return true;
    });
    setFilteredProperties(filtered);
  };

  const applyFilters = () => {
    applyFiltersWithParams();
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando propiedades...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-2">Error al cargar las propiedades</p>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header animado */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Propiedades en Venta
        </h1>
        <p className="text-lg text-gray-600">
          Encuentra la propiedad perfecta para comprar
        </p>
      </motion.div>

      {/* Filtros animados */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="mb-8 bg-white border-gray-200">
          <CardContent className="p-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-[#ff8425]" />
              <h2 className="text-lg font-semibold text-gray-900">Filtros de búsqueda</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="tipo" className="text-gray-700 font-medium">Tipo de propiedad</Label>
                <Select value={filters.tipo} onValueChange={(value) => setFilters({...filters, tipo: value})}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="oficina">Oficina</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dormitorios" className="text-gray-700 font-medium">Dormitorios</Label>
                <Select value={filters.dormitorios} onValueChange={(value) => setFilters({...filters, dormitorios: value})}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="cualquiera">Cualquiera</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="precioMin" className="text-gray-700 font-medium">Precio mínimo</Label>
                <Input
                  id="precioMin"
                  type="number"
                  placeholder="$100,000"
                  value={filters.precioMin}
                  onChange={(e) => setFilters({...filters, precioMin: e.target.value})}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="precioMax" className="text-gray-700 font-medium">Precio máximo</Label>
                <Input
                  id="precioMax"
                  type="number"
                  placeholder="$500,000"
                  value={filters.precioMax}
                  onChange={(e) => setFilters({...filters, precioMax: e.target.value})}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="barrio" className="text-gray-700 font-medium">Barrio</Label>
                <Input
                  id="barrio"
                  type="text"
                  placeholder="Ej: Centro"
                  value={filters.barrio}
                  onChange={(e) => setFilters({...filters, barrio: e.target.value})}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
            </div>

            <Button onClick={applyFilters} className="mt-4 bg-[#ff8425] hover:bg-[#e6741f] text-white">
              <Search className="w-4 h-4 mr-2" />
              Aplicar filtros
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Resultados */}
      <div className="mb-6">
        <p className="text-gray-600">
          Se encontraron <span className="font-semibold text-gray-800">{filteredProperties.length}</span> propiedades en venta
        </p>
      </div>

      {filteredProperties.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <div className="text-gray-500 mb-4">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No se encontraron propiedades</p>
            <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <PropertyCard
                id={property.id}
                title={property.title}
                price={formatPrice(property.price, property.currency)}
                location={`${property.address}, ${property.neighborhood}`}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={`${property.area_m2} m²`}
                image={property.images.length > 0 ? property.images[0] : '/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png'}
                type={property.operation_type}
                propertyType={property.property_type}
                images={property.images}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function VentasPageFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#ff8425] mx-auto mb-4" />
          <p className="text-gray-600">Cargando página...</p>
        </div>
      </div>
    </div>
  );
}

export default function VentasPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Suspense fallback={<VentasPageFallback />}>
        <VentasContent />
      </Suspense>
      <Footer />
    </div>
  );
}