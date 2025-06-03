'use client';

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "Error 404: El usuario intentó acceder a una ruta inexistente:",
      pathname
    );
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">¡Oops! Página no encontrada</p>
        <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
} 