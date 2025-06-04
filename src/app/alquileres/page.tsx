'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Bed, Bath, Square, Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useProperties, Property } from '@/hooks/useProperties';

export default function AlquileresPage() {
  const { properties: allProperties, isLoading, error } = useProperties();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState({
    tipo: 'todos',
    dormitorios: 'cualquiera',
    precioMin: '',
    precioMax: '',
    barrio: ''
  });

  // Filtrar solo propiedades en alquiler y disponibles
  const alquilerProperties = allProperties.filter(property => 
    property.operation_type === 'alquiler' && property.status === 'disponible'
  );

  useEffect(() => {
    setFilteredProperties(alquilerProperties);
  }, [allProperties]);

  const applyFilters = () => {
    let filtered = alquilerProperties.filter(property => {
      if (filters.tipo !== 'todos' && property.property_type !== filters.tipo) return false;
      if (filters.dormitorios !== 'cualquiera') {
        if (filters.dormitorios === '4' && property.bedrooms < 4) return false;
        if (filters.dormitorios !== '4' && property.bedrooms.toString() !== filters.dormitorios) return false;
      }
      if (filters.precioMin && property.price < parseInt(filters.precioMin)) return false;
      if (filters.precioMax && property.price > parseInt(filters.precioMax)) return false;
      if (filters.barrio && property.neighborhood && !property.neighborhood.toLowerCase().includes(filters.barrio.toLowerCase())) return false;
      return true;
    });
    setFilteredProperties(filtered);
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
            Propiedades en Alquiler
          </h1>
          <p className="text-lg text-gray-600">
            Encuentra el lugar perfecto para alquilar
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Filtros de búsqueda</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="tipo">Tipo de propiedad</Label>
                <Select value={filters.tipo} onValueChange={(value) => setFilters({...filters, tipo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Label htmlFor="dormitorios">Dormitorios</Label>
                <Select value={filters.dormitorios} onValueChange={(value) => setFilters({...filters, dormitorios: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cualquiera">Cualquiera</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="precioMin">Precio mínimo</Label>
                <Input
                  id="precioMin"
                  type="number"
                  placeholder="$500"
                  value={filters.precioMin}
                  onChange={(e) => setFilters({...filters, precioMin: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="precioMax">Precio máximo</Label>
                <Input
                  id="precioMax"
                  type="number"
                  placeholder="$2000"
                  value={filters.precioMax}
                  onChange={(e) => setFilters({...filters, precioMax: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="barrio">Barrio</Label>
                <Input
                  id="barrio"
                  placeholder="Buscar barrio"
                  value={filters.barrio}
                  onChange={(e) => setFilters({...filters, barrio: e.target.value})}
                />
              </div>
            </div>

            <Button onClick={applyFilters} className="mt-4 bg-blue-600 hover:bg-blue-700">
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
              {alquilerProperties.length === 0 
                ? "Aún no hay propiedades en alquiler publicadas."
                : "No se encontraron propiedades con los filtros seleccionados. Intenta ajustar tus criterios de búsqueda."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
                <div className="aspect-video bg-gray-200 relative">
                  {property.images.length > 0 ? (
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <div className="text-center text-gray-500">
                        <Square className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm font-medium">Sin imagen</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                    {formatPrice(property.price, property.currency)}/mes
                  </div>
                  {property.featured && (
                    <div className="absolute top-4 left-4 bg-orange-600 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">
                      Destacada
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-900">{property.title}</h3>
                  <div className="flex items-center text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 mr-1 text-gray-600" />
                    <span className="text-sm font-medium">
                      {property.address || property.neighborhood || property.city || 'Ubicación no especificada'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-700 mb-4 font-medium">
                    {property.bedrooms > 0 && (
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1 text-gray-600" />
                        <span>{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1 text-gray-600" />
                        <span>{property.bathrooms}</span>
                      </div>
                    )}
                    {property.area_m2 && (
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1 text-gray-600" />
                        <span>{property.area_m2}m²</span>
                      </div>
                    )}
                  </div>
                  
                  {property.features.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {property.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="bg-purple-50 text-purple-800 text-xs px-2 py-1 rounded font-medium border border-purple-200">
                            {feature}
                          </span>
                        ))}
                        {property.features.length > 3 && (
                          <span className="bg-purple-50 text-purple-800 text-xs px-2 py-1 rounded font-medium border border-purple-200">
                            +{property.features.length - 3} más
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    Ver detalles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}