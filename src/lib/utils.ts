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
