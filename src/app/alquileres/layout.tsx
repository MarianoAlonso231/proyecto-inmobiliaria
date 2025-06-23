import { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo';

// Metadata optimizada para la página de alquileres
export const metadata: Metadata = generateSEOMetadata({
  pageType: 'alquileres',
  operation: 'alquiler'
});

export default function AlquileresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 