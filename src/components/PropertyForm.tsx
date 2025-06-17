'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { PropertyFormData } from '@/hooks/useProperties';
import { ImageUploaderDeferred, ImageItem } from '@/components/ImageUploaderDeferred';

interface PropertyFormProps {
  formData: PropertyFormData;
  onInputChange: (field: keyof PropertyFormData, value: string | boolean | ImageItem[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

export function PropertyForm({ 
  formData, 
  onInputChange, 
  onSubmit, 
  isLoading, 
  isEditing, 
  onCancel 
}: PropertyFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-white text-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información Básica */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-700 font-medium">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => onInputChange('title', e.target.value)}
              placeholder="Ej: Casa moderna en el centro"
              required
              className="mt-1 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="price" className="text-gray-700 font-medium">Precio *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => onInputChange('price', e.target.value)}
              placeholder="250000"
              required
              className="mt-1 bg-white border-gray-300 text-gray-900 focus:border-primary-400 focus:ring-primary-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="currency" className="text-gray-700 font-medium">Moneda</Label>
              <Select value={formData.currency} onValueChange={(value) => onInputChange('currency', value)}>
                <SelectTrigger className="mt-1 bg-white border-gray-300 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="ARS">ARS</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="operation_type" className="text-gray-700 font-medium">Operación *</Label>
              <Select value={formData.operation_type} onValueChange={(value) => onInputChange('operation_type', value)}>
                <SelectTrigger className="mt-1 bg-white border-gray-300 focus:border-blue-500">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="venta">Venta</SelectItem>
                  <SelectItem value="alquiler">Alquiler</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="property_type" className="text-gray-700 font-medium">Tipo de Propiedad *</Label>
            <Select value={formData.property_type} onValueChange={(value) => onInputChange('property_type', value)}>
              <SelectTrigger className="mt-1 bg-white border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200">
                <SelectItem value="casa">Casa</SelectItem>
                <SelectItem value="apartamento">Apartamento</SelectItem>
                <SelectItem value="oficina">Oficina</SelectItem>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="terreno">Terreno</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="bedrooms" className="text-gray-700 font-medium">Dormitorios</Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                max="20"
                value={formData.bedrooms}
                onChange={(e) => onInputChange('bedrooms', e.target.value)}
                className="mt-1 bg-white border-gray-300 text-gray-900 focus:border-primary-400 focus:ring-primary-400"
              />
            </div>
            <div>
              <Label htmlFor="bathrooms" className="text-gray-700 font-medium">Baños</Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                max="20"
                value={formData.bathrooms}
                onChange={(e) => onInputChange('bathrooms', e.target.value)}
                className="mt-1 bg-white border-gray-300 text-gray-900 focus:border-primary-400 focus:ring-primary-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="construccion" className="text-gray-700 font-medium">Construcción (m²)</Label>
              <Input
                id="construccion"
                type="number"
                step="0.01"
                min="0"
                value={formData.construccion}
                onChange={(e) => onInputChange('construccion', e.target.value)}
                placeholder="150.5"
                className="mt-1 bg-white border-gray-300 text-gray-900 focus:border-primary-400 focus:ring-primary-400"
              />
            </div>
            <div>
              <Label htmlFor="terreno" className="text-gray-700 font-medium">Terreno (m²)</Label>
              <Input
                id="terreno"
                type="number"
                step="0.01"
                min="0"
                value={formData.terreno}
                onChange={(e) => onInputChange('terreno', e.target.value)}
                placeholder="200.0"
                className="mt-1 bg-white border-gray-300 text-gray-900 focus:border-primary-400 focus:ring-primary-400"
              />
            </div>
          </div>
        </div>

        {/* Ubicación y Detalles */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="address" className="text-gray-700 font-medium">Dirección</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
              placeholder="Calle San Martín 123"
              className="mt-1 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="neighborhood" className="text-gray-700 font-medium">Barrio</Label>
            <Input
              id="neighborhood"
              value={formData.neighborhood}
              onChange={(e) => onInputChange('neighborhood', e.target.value)}
              placeholder="Centro"
              className="mt-1 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="city" className="text-gray-700 font-medium">Ciudad</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => onInputChange('city', e.target.value)}
                className="mt-1 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="province" className="text-gray-700 font-medium">Provincia</Label>
              <Input
                id="province"
                value={formData.province}
                onChange={(e) => onInputChange('province', e.target.value)}
                className="mt-1 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="features" className="text-gray-700 font-medium">Características (separadas por comas)</Label>
            <Input
              id="features"
              value={formData.features}
              onChange={(e) => onInputChange('features', e.target.value)}
              placeholder="garage, jardín, piscina, aire acondicionado"
              className="mt-1 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ejemplos: garage, jardín, piscina, aire acondicionado, cocina equipada, seguridad 24h
            </p>
          </div>

          <div>
            <Label className="text-gray-700 font-medium">Imágenes de la Propiedad</Label>
            <ImageUploaderDeferred
              value={formData.images}
              onChange={(imageItems) => onInputChange('images', imageItems)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="status" className="text-gray-700 font-medium">Estado</Label>
              <Select value={formData.status} onValueChange={(value) => onInputChange('status', value)}>
                <SelectTrigger className="mt-1 bg-white border-gray-300 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                  <SelectItem value="alquilado">Alquilado</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => onInputChange('featured', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 bg-white focus:border-primary-400 focus:ring-primary-400"
              />
              <Label htmlFor="featured" className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Propiedad Destacada
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="text-gray-700 font-medium">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Descripción detallada de la propiedad. Incluye detalles sobre las comodidades, ubicación, estado de la propiedad, etc."
          rows={4}
          className="mt-1 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="min-w-[140px] bg-primary-400 hover:bg-primary-500 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Actualizando...' : 'Creando...'}
            </>
          ) : (
            isEditing ? 'Actualizar Propiedad' : 'Crear Propiedad'
          )}
        </Button>
      </div>
    </form>
  );
} 