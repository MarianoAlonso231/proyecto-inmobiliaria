import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Group Inmobiliaria",
  description: "Tu inmobiliaria de confianza",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="light bg-white" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-gray-900 min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}