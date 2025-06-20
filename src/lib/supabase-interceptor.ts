import { supabase } from './supabase';

// Tipo para errores de Supabase
interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

class AuthInterceptor {
  private isRefreshing = false;
  private refreshPromise?: Promise<boolean>;

  // Detectar si un error es relacionado con JWT/autenticación
  private isAuthError(error: any): boolean {
    if (!error) return false;
    
    const errorMessage = error.message?.toLowerCase() || '';
    const errorCode = error.code?.toLowerCase() || '';
    
    return (
      errorMessage.includes('jwt') ||
      errorMessage.includes('expired') ||
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('invalid token') ||
      errorMessage.includes('token not provided') ||
      errorCode === 'pgrst301' || // JWT expired
      errorCode === 'unauthorized'
    );
  }

  // Intentar renovar la sesión
  private async tryRefreshSession(): Promise<boolean> {
    if (this.isRefreshing) {
      return this.refreshPromise || Promise.resolve(false);
    }

    this.isRefreshing = true;
    
    this.refreshPromise = (async () => {
      try {
        console.log('🔄 Intentando renovar sesión...');
        
        const { data, error } = await supabase.auth.refreshSession();
        
        if (error || !data.session) {
          console.error('❌ Error al renovar sesión:', error);
          this.handleAuthFailure();
          return false;
        }
        
        console.log('✅ Sesión renovada exitosamente');
        return true;
        
      } catch (error) {
        console.error('❌ Error crítico al renovar sesión:', error);
        this.handleAuthFailure();
        return false;
      } finally {
        this.isRefreshing = false;
      }
    })();

    return this.refreshPromise;
  }

  // Manejar fallo de autenticación
  private handleAuthFailure(): void {
    console.log('🚪 Redirigiendo al login por fallo de autenticación');
    
    // Limpiar la sesión local
    supabase.auth.signOut();
    
    // Mostrar mensaje al usuario
    if (typeof window !== 'undefined') {
      // Solo mostrar alerta si estamos en una página de admin
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        alert('Tu sesión ha expirado. Serás redirigido al login.');
      }
      
      // Redirigir al login
      window.location.href = '/admin/login';
    }
  }

  // Interceptar y manejar errores de operaciones de Supabase
  async handleSupabaseError(error: any, operation: string = 'operación'): Promise<boolean> {
    if (!this.isAuthError(error)) {
      // No es un error de autenticación, dejarlo pasar
      return false;
    }

    console.log(`🔒 Error de autenticación detectado en ${operation}:`, error.message);

    // Intentar renovar la sesión una vez
    const refreshSuccess = await this.tryRefreshSession();
    
    if (!refreshSuccess) {
      console.log(`❌ No se pudo recuperar la sesión para ${operation}`);
      return false;
    }

    console.log(`✅ Sesión recuperada para ${operation}`);
    return true;
  }

  // Wrapper para operaciones de Supabase con manejo automático de errores
  async withAuthRetry<T>(
    operation: () => Promise<{ data: T; error: any }>,
    operationName: string = 'operación'
  ): Promise<{ data: T | null; error: any; recoveredFromAuth?: boolean }> {
    try {
      // Primera tentativa
      let result = await operation();
      
      // Si hay error de autenticación, intentar renovar y reintentar
      if (result.error && this.isAuthError(result.error)) {
        const recovered = await this.handleSupabaseError(result.error, operationName);
        
        if (recovered) {
          // Reintentar la operación
          console.log(`🔄 Reintentando ${operationName} después de renovar sesión...`);
          result = await operation();
          return { ...result, recoveredFromAuth: true };
        }
      }
      
      return result;
      
    } catch (error) {
      console.error(`Error crítico en ${operationName}:`, error);
      return { data: null, error, recoveredFromAuth: false };
    }
  }
}

// Instancia singleton
export const authInterceptor = new AuthInterceptor();

// Helper function para uso fácil
export const withAuthRetry = authInterceptor.withAuthRetry.bind(authInterceptor); 