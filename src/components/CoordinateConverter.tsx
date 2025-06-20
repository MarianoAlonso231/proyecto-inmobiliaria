'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calculator, RotateCcw } from 'lucide-react';

interface CoordinateConverterProps {
  latitude: string;
  longitude: string;
  onLatitudeChange: (value: string) => void;
  onLongitudeChange: (value: string) => void;
}

interface DMSCoordinates {
  degrees: string;
  minutes: string;
  seconds: string;
  direction: string;
}

export function CoordinateConverter({
  latitude,
  longitude,
  onLatitudeChange,
  onLongitudeChange
}: CoordinateConverterProps) {
  const [useGMS, setUseGMS] = useState(false);
  const [latitudeDMS, setLatitudeDMS] = useState<DMSCoordinates>({
    degrees: '',
    minutes: '',
    seconds: '',
    direction: 'S'
  });
  const [longitudeDMS, setLongitudeDMS] = useState<DMSCoordinates>({
    degrees: '',
    minutes: '',
    seconds: '',
    direction: 'O'
  });

  // Convertir decimal a DMS
  const decimalToDMS = (decimal: number): { degrees: number; minutes: number; seconds: number } => {
    const absolute = Math.abs(decimal);
    const degrees = Math.floor(absolute);
    const minutesFloat = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesFloat);
    const seconds = (minutesFloat - minutes) * 60;
    
    return { degrees, minutes, seconds };
  };

  // Convertir DMS a decimal
  const dmsToDecimal = (dms: DMSCoordinates): number => {
    const degrees = parseFloat(dms.degrees) || 0;
    const minutes = parseFloat(dms.minutes) || 0;
    const seconds = parseFloat(dms.seconds) || 0;
    
    let decimal = degrees + (minutes / 60) + (seconds / 3600);
    
    // Aplicar signo según dirección
    if (dms.direction === 'S' || dms.direction === 'O') {
      decimal = -decimal;
    }
    
    return decimal;
  };

  // Actualizar DMS cuando cambia el valor decimal
  useEffect(() => {
    if (!useGMS && latitude) {
      const lat = parseFloat(latitude);
      if (!isNaN(lat)) {
        const dms = decimalToDMS(lat);
        setLatitudeDMS({
          degrees: dms.degrees.toString(),
          minutes: dms.minutes.toString(),
          seconds: dms.seconds.toFixed(2),
          direction: lat >= 0 ? 'N' : 'S'
        });
      }
    }

    if (!useGMS && longitude) {
      const lng = parseFloat(longitude);
      if (!isNaN(lng)) {
        const dms = decimalToDMS(lng);
        setLongitudeDMS({
          degrees: dms.degrees.toString(),
          minutes: dms.minutes.toString(),
          seconds: dms.seconds.toFixed(2),
          direction: lng >= 0 ? 'E' : 'O'
        });
      }
    }
  }, [latitude, longitude, useGMS]);

  // Actualizar decimal cuando cambia DMS
  const handleDMSChange = (coord: 'latitude' | 'longitude', field: keyof DMSCoordinates, value: string) => {
    const currentDMS = coord === 'latitude' ? latitudeDMS : longitudeDMS;
    const newDMS = { ...currentDMS, [field]: value };
    
    if (coord === 'latitude') {
      setLatitudeDMS(newDMS);
      const decimal = dmsToDecimal(newDMS);
      if (!isNaN(decimal) && isFinite(decimal)) {
        onLatitudeChange(decimal.toFixed(7));
      } else {
        console.warn('⚠️ CoordinateConverter - Latitud inválida:', { decimal, dms: newDMS });
      }
    } else {
      setLongitudeDMS(newDMS);
      const decimal = dmsToDecimal(newDMS);
      if (!isNaN(decimal) && isFinite(decimal)) {
        onLongitudeChange(decimal.toFixed(7));
      } else {
        console.warn('⚠️ CoordinateConverter - Longitud inválida:', { decimal, dms: newDMS });
      }
    }
  };

  const clearAll = () => {
    onLatitudeChange('');
    onLongitudeChange('');
    setLatitudeDMS({ degrees: '', minutes: '', seconds: '', direction: 'S' });
    setLongitudeDMS({ degrees: '', minutes: '', seconds: '', direction: 'O' });
  };

  return (
    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calculator className="w-4 h-4 text-blue-600" />
          <Label className="text-blue-800 font-medium">Convertidor de Coordenadas</Label>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearAll}
          className="text-blue-600 border-blue-300 hover:bg-blue-100"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Limpiar
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Label className="text-sm text-blue-700">Formato Decimal</Label>
        <Switch
          checked={useGMS}
          onCheckedChange={setUseGMS}
          className="data-[state=checked]:bg-blue-600"
        />
        <Label className="text-sm text-blue-700">Formato GMS</Label>
      </div>

      {useGMS ? (
        // Formato GMS
        <div className="space-y-4">
          {/* Latitud GMS */}
          <div>
            <Label className="text-sm font-medium text-blue-800 mb-2 block">
              Latitud (Grados° Minutos' Segundos")
            </Label>
            <div className="grid grid-cols-4 gap-2">
              <Input
                type="number"
                min="0"
                max="90"
                value={latitudeDMS.degrees}
                onChange={(e) => handleDMSChange('latitude', 'degrees', e.target.value)}
                placeholder="27"
                className="bg-white border-blue-300 focus:border-blue-500"
              />
              <Input
                type="number"
                min="0"
                max="59"
                value={latitudeDMS.minutes}
                onChange={(e) => handleDMSChange('latitude', 'minutes', e.target.value)}
                placeholder="26"
                className="bg-white border-blue-300 focus:border-blue-500"
              />
              <Input
                type="number"
                min="0"
                max="59.999"
                step="0.001"
                value={latitudeDMS.seconds}
                onChange={(e) => handleDMSChange('latitude', 'seconds', e.target.value)}
                placeholder="27.26"
                className="bg-white border-blue-300 focus:border-blue-500"
              />
              <Select
                value={latitudeDMS.direction}
                onValueChange={(value) => handleDMSChange('latitude', 'direction', value)}
              >
                <SelectTrigger className="bg-white border-blue-300 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="N">Norte</SelectItem>
                  <SelectItem value="S">Sur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs text-blue-600 mt-1">
              <span>Grados</span>
              <span>Minutos</span>
              <span>Segundos</span>
              <span>Dirección</span>
            </div>
          </div>

          {/* Longitud GMS */}
          <div>
            <Label className="text-sm font-medium text-blue-800 mb-2 block">
              Longitud (Grados° Minutos' Segundos")
            </Label>
            <div className="grid grid-cols-4 gap-2">
              <Input
                type="number"
                min="0"
                max="180"
                value={longitudeDMS.degrees}
                onChange={(e) => handleDMSChange('longitude', 'degrees', e.target.value)}
                placeholder="64"
                className="bg-white border-blue-300 focus:border-blue-500"
              />
              <Input
                type="number"
                min="0"
                max="59"
                value={longitudeDMS.minutes}
                onChange={(e) => handleDMSChange('longitude', 'minutes', e.target.value)}
                placeholder="53"
                className="bg-white border-blue-300 focus:border-blue-500"
              />
              <Input
                type="number"
                min="0"
                max="59.999"
                step="0.001"
                value={longitudeDMS.seconds}
                onChange={(e) => handleDMSChange('longitude', 'seconds', e.target.value)}
                placeholder="23.29"
                className="bg-white border-blue-300 focus:border-blue-500"
              />
              <Select
                value={longitudeDMS.direction}
                onValueChange={(value) => handleDMSChange('longitude', 'direction', value)}
              >
                <SelectTrigger className="bg-white border-blue-300 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="E">Este</SelectItem>
                  <SelectItem value="O">Oeste</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs text-blue-600 mt-1">
              <span>Grados</span>
              <span>Minutos</span>
              <span>Segundos</span>
              <span>Dirección</span>
            </div>
          </div>

          {/* Resultado decimal */}
          <div className="p-3 bg-blue-100 rounded border border-blue-300">
            <Label className="text-sm font-medium text-blue-800 mb-2 block">
              Resultado en Formato Decimal:
            </Label>
            <div className="grid grid-cols-2 gap-2 text-sm font-mono">
              <div>
                <span className="text-blue-600">Latitud:</span> {latitude || '0.000000'}
              </div>
              <div>
                <span className="text-blue-600">Longitud:</span> {longitude || '0.000000'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Formato Decimal
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm font-medium text-blue-800">Latitud (Decimal)</Label>
            <Input
              type="number"
              step="0.0000001"
              value={latitude}
              onChange={(e) => onLatitudeChange(e.target.value)}
              placeholder="-26.8083"
              className="mt-1 bg-white border-blue-300 focus:border-blue-500"
            />
            <p className="text-xs text-blue-600 mt-1">
              Ejemplo: -26.8083 (negativo para Sur)
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-blue-800">Longitud (Decimal)</Label>
            <Input
              type="number"
              step="0.0000001"
              value={longitude}
              onChange={(e) => onLongitudeChange(e.target.value)}
              placeholder="-65.2176"
              className="mt-1 bg-white border-blue-300 focus:border-blue-500"
            />
            <p className="text-xs text-blue-600 mt-1">
              Ejemplo: -65.2176 (negativo para Oeste)
            </p>
          </div>
        </div>
      )}

      <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded">
        <strong>💡 Consejo:</strong> Para Tucumán, generalmente usamos coordenadas Sur (S) y Oeste (O).
        Ejemplo: 27°26'27.26"S, 64°53'23.29"O
      </div>
    </div>
  );
} 