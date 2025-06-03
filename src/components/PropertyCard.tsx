'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import { useState } from 'react';

interface PropertyCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
  type: 'venta' | 'alquiler';
  propertyType: string;
}

const PropertyCard = ({ 
  id, 
  title, 
  price, 
  location, 
  bedrooms, 
  bathrooms, 
  area, 
  image, 
  type, 
  propertyType 
}: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="group overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge 
            variant={type === 'venta' ? 'default' : 'secondary'}
            className={`${type === 'venta' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            {type === 'venta' ? 'Venta' : 'Alquiler'}
          </Badge>
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
        >
          <Heart 
            className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
        <div className="absolute bottom-3 left-3">
          <Badge variant="outline" className="bg-white/90 text-gray-700">
            {propertyType}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{bedrooms}</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{bathrooms}</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            <span>{area}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary-400">
            {price}
          </div>
          <Button 
            size="sm" 
            className="bg-primary-400 hover:bg-primary-500 text-white"
          >
            Ver detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;