'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Bed, Bath, Square, Search, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Property {
  id: string;
  title: string;
  price: number;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area_m2: number;
  address: string;
  neighborhood: string;
  images: string[];
  features: string[];
}

export default function VentasPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState({
    tipo: 'todos',
    dormitorios: 'cualquiera',
    precioMin: '',
    precioMax: '',
    barrio: ''
  });

  // Datos de ejemplo para propiedades en venta
  useEffect(() => {
    const sampleProperties: Property[] = [
      {
        id: '1',
        title: 'Casa moderna en el centro',
        price: 250000,
        property_type: 'casa',
        bedrooms: 3,
        bathrooms: 2,
        area_m2: 150,
        address: 'Calle San Martín 123',
        neighborhood: 'Centro',
        images: ['/placeholder.svg'],
        features: ['garage', 'jardin', 'cocina_equipada']
      },
      {
        id: '2',
        title: 'Apartamento con vista panorámica',
        price: 180000,
        property_type: 'apartamento',
        bedrooms: 2,
        bathrooms: 1,
        area_m2: 80,
        address: 'Av. Belgrano 456',
        neighborhood: 'Norte',
        images: ['/placeholder.svg'],
        features: ['balcon', 'aire_acondicionado', 'seguridad_24h']
      },
      {
        id: '3',
        title: 'Casa familiar con jardín',
        price: 320000,
        property_type: 'casa',
        bedrooms: 4,
        bathrooms: 3,
        area_m2: 200,
        address: 'Barrio Jardín 789',
        neighborhood: 'Jardín',
        images: ['/placeholder.svg'],
        features: ['garage', 'jardin', 'piscina', 'asador']
      }
    ];
    setProperties(sampleProperties);
    setFilteredProperties(sampleProperties);
  }, []);

  const applyFilters = () => {
    let filtered = properties.filter(property => {
      if (filters.tipo !== 'todos' && property.property_type !== filters.tipo) return false;
      if (filters.dormitorios !== 'cualquiera' && property.bedrooms.toString() !== filters.dormitorios) return false;
      if (filters.precioMin && property.price < parseInt(filters.precioMin)) return false;
      if (filters.precioMax && property.price > parseInt(filters.precioMax)) return false;
      if (filters.barrio && !property.neighborhood.toLowerCase().includes(filters.barrio.toLowerCase())) return false;
      return true;
    });
    setFilteredProperties(filtered);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Propiedades en Venta
          </h1>
          <p className="text-lg text-gray-600">
            Encuentra la propiedad perfecta para comprar
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary-400" />
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
                  placeholder="$100,000"
                  value={filters.precioMin}
                  onChange={(e) => setFilters({...filters, precioMin: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="precioMax">Precio máximo</Label>
                <Input
                  id="precioMax"
                  type="number"
                  placeholder="$500,000"
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

            <Button onClick={applyFilters} className="mt-4 bg-primary-400 hover:bg-primary-500">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <img 
                  src={property.images[0]} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-primary-400 text-white px-2 py-1 rounded text-sm font-semibold">
                  {formatPrice(property.price)}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.address}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    {property.bedrooms}
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    {property.bathrooms}
                  </div>
                  <div className="flex items-center">
                    <Square className="w-4 h-4 mr-1" />
                    {property.area_m2}m²
                  </div>
                </div>
                <Button className="w-full bg-primary-400 hover:bg-primary-500">
                  Ver detalles
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}