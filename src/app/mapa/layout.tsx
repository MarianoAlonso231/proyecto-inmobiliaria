import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mapa de Propiedades - Ubicaciones Exactas | Group Inmobiliaria',
  description: 'Explora todas nuestras propiedades en el mapa interactivo. Encuentra la ubicación exacta de casas, departamentos y terrenos disponibles en Tucumán.',
  keywords: 'mapa propiedades, ubicación exacta, inmobiliaria tucumán, casas terrenos departamentos mapa',
  openGraph: {
    title: 'Mapa de Propiedades - Group Inmobiliaria',
    description: 'Descubre la ubicación exacta de todas nuestras propiedades en el mapa interactivo',
    type: 'website',
  },
};

export default function MapaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 