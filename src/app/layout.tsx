import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { generateSEOMetadata } from "@/lib/seo";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-heading",
  display: 'swap',
});

const openSans = Open_Sans({ 
  subsets: ["latin"],
  variable: "--font-body",
  display: 'swap',
});

// SEO optimizado para la página principal
export const metadata: Metadata = generateSEOMetadata({
  pageType: 'home'
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`light bg-white ${montserrat.variable} ${openSans.variable}`} suppressHydrationWarning>
      <head>
        {/* Favicon adicional para máxima compatibilidad */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        <meta name="msapplication-TileImage" content="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#ffffff" />
      </head>
      <body className={`${openSans.className} bg-white text-gray-900 min-h-screen font-body`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}