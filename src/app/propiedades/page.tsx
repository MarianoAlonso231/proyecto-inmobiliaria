'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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

export default function PropiedadesPage() {
  const { properties: allProperties, isLoading, error } = useProperties();
  const searchParams = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState({
    operacion: 'todas',
    tipo: 'todos',
    dormitorios: 'cualquiera',
    precioMin: '',
    precioMax: '',
    barrio: ''
  });

  // Filtrar solo propiedades disponibles
  const availableProperties = allProperties.filter(property => 
    property.status === 'disponible'
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
        operacion: 'todas',
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
      setFilteredProperties(availableProperties);
    }
  }, [allProperties, searchParams]);

  const applyFiltersWithParams = (filtersToApply = filters) => {
    let filtered = availableProperties.filter(property => {
      if (filtersToApply.operacion !== 'todas' && property.operation_type !== filtersToApply.operacion) return false;
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

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Cargando propiedades...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-2">Error al cargar las propiedades</p>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Todas las Propiedades
          </h1>
          <p className="text-lg text-gray-600">
            Explora todas nuestras propiedades disponibles
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-8 bg-white border-gray-200">
          <CardContent className="p-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary-400" />
              <h2 className="text-lg font-semibold text-gray-900">Filtros de búsqueda</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="operacion" className="text-gray-700 font-medium">Operación</Label>
                <Select value={filters.operacion} onValueChange={(value) => setFilters({...filters, operacion: value})}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="venta">Venta</SelectItem>
                    <SelectItem value="alquiler">Alquiler</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                  placeholder="Buscar barrio"
                  value={filters.barrio}
                  onChange={(e) => setFilters({...filters, barrio: e.target.value})}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
            </div>

            <Button onClick={applyFilters} className="mt-4 bg-primary-400 hover:bg-primary-500 text-white">
              <Search className="w-4 h-4 mr-2" />
              Aplicar filtros
            </Button>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredProperties.length} propiedades encontradas
          </p>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay propiedades disponibles</h3>
            <p className="text-gray-600">
              {availableProperties.length === 0 
                ? "Aún no hay propiedades publicadas."
                : "No se encontraron propiedades con los filtros seleccionados. Intenta ajustar tus criterios de búsqueda."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                price={formatPrice(property.price, property.currency)}
                location={property.address || property.neighborhood || property.city || 'Ubicación no especificada'}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area_m2 ? `${property.area_m2}m²` : 'No especificada'}
                image={property.images.length > 0 ? property.images[0] : '/placeholder.svg'}
                type={property.operation_type}
                propertyType={property.property_type}
                images={property.images}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
} 