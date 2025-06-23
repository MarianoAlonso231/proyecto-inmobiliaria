import { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo';

// Metadata optimizada para la página de ventas
export const metadata: Metadata = generateSEOMetadata({
  pageType: 'ventas',
  operation: 'venta'
});

export default function VentasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 