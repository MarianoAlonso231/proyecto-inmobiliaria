import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';

// Constantes para rutas
const ADMIN_LOGIN_PATH = '/admin/login';
const ADMIN_DASHBOARD_PATH = '/admin/dashboard';
const ADMIN_BASE_PATH = '/admin';

// Tipos para mejor tipado
interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createClient(request);
    const { pathname } = request.nextUrl;

    // Verificar usuario (método seguro)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // Si hay un error al obtener el usuario
    if (userError) {
      console.error('Error al obtener el usuario:', userError);
      return handleAuthError(request, pathname);
    }

    // Rutas protegidas del admin (excluyendo /admin/login)
    if (isProtectedAdminRoute(pathname)) {
      return await handleProtectedRoute(supabase, user, request, response);
    }

    // Si el usuario está autenticado y está intentando acceder al login del admin
    if (user && pathname === ADMIN_LOGIN_PATH) {
      return await handleAdminLoginRedirect(supabase, user, request);
    }

    return response;
    
  } catch (error) {
    console.error('Error crítico en middleware:', error);
    return handleCriticalError(request);
  }
}

// Funciones auxiliares para mejor organización del código
function isProtectedAdminRoute(pathname: string): boolean {
  return pathname.startsWith(ADMIN_BASE_PATH) && pathname !== ADMIN_LOGIN_PATH;
}

function handleAuthError(request: NextRequest, pathname: string): NextResponse {
  if (isProtectedAdminRoute(pathname)) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
  }
  return NextResponse.next();
}

async function handleProtectedRoute(
  supabase: any,
  user: any,
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  if (!user) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
  }

  try {
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('id, email, created_at')
      .eq('email', user.email)
      .single();

    if (error || !adminUser) {
      console.error('Usuario no encontrado en admin_users:', error);
      return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
    }

    // Usuario verificado como admin, continuar
    return response;
    
  } catch (error) {
    console.error('Error al verificar admin:', error);
    return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
  }
}

async function handleAdminLoginRedirect(
  supabase: any,
  user: any,
  request: NextRequest
): Promise<NextResponse> {
  try {
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id, email')
      .eq('email', user.email)
      .single();

    if (adminUser) {
      return NextResponse.redirect(new URL(ADMIN_DASHBOARD_PATH, request.url));
    }
  } catch (error) {
    console.error('Error al verificar admin en login:', error);
  }
  
  return NextResponse.next();
}

function handleCriticalError(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  if (isProtectedAdminRoute(pathname)) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}; 