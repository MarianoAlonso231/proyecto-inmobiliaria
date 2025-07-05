import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para formatear precios con moneda
export function formatPrice(price: number, currency: string = 'USD'): string {
  // Formatear el número con separadores de miles
  const formattedNumber = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
  
  // Retornar con la moneda al principio
  return `${currency} ${formattedNumber}`;
}

// Función para obtener el símbolo de moneda
export function getCurrencySymbol(currency: string): string {
  switch (currency.toUpperCase()) {
    case 'USD':
      return 'US$';
    case 'ARS':
      return '$';
    case 'EUR':
      return '€';
    default:
      return currency;
  }
}

// Función para formatear precio con símbolo
export function formatPriceWithSymbol(price: number, currency: string = 'USD'): string {
  const symbol = getCurrencySymbol(currency);
  const formattedNumber = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
  
  return `${symbol} ${formattedNumber}`;
}

// Función para formatear tipos de propiedad
export function formatPropertyType(type: string): string {
  const typeMap: { [key: string]: string } = {
    'casa': 'Casa',
    'apartamento': 'Departamento',
    'oficina': 'Oficina',
    'local': 'Local',
    'terreno': 'Terreno',
    'estacionamiento': 'Estacionamiento'
  };
  
  return typeMap[type.toLowerCase()] || type;
}

// Función para obtener el área correcta según el tipo de propiedad
export function getPropertyArea(propertyType: string, construccion?: number | null, terreno?: number | null): string {
  // Para terrenos, mostrar el área del terreno
  if (propertyType.toLowerCase() === 'terreno') {
    return terreno ? `${terreno}m²` : 'N/A';
  }
  
  // Para estacionamientos, mostrar la construcción como área del estacionamiento
  if (propertyType.toLowerCase() === 'estacionamiento') {
    return construccion ? `${construccion}m²` : 'N/A';
  }
  
  // Para otros tipos de propiedad, mostrar la construcción
  return construccion ? `${construccion}m²` : 'N/A';
}
