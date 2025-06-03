import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

// Validar variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables de entorno de Supabase no configuradas correctamente');
}

export const createClient = (request: NextRequest) => {
  // Crear una única instancia de respuesta que será modificada
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Establecer la cookie en la respuesta existente
          response.cookies.set({
            name,
            value,
            ...options,
            // Configuración de seguridad por defecto
            httpOnly: options.httpOnly ?? true,
            secure: options.secure ?? process.env.NODE_ENV === 'production',
            sameSite: options.sameSite ?? 'lax',
          });
        },
        remove(name: string, options: CookieOptions) {
          // Eliminar la cookie de la respuesta existente
          response.cookies.set({
            name,
            value: '',
            maxAge: 0,
            ...options,
          });
        },
      },
    }
  );

  return { supabase, response };
};