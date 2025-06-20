/**
 * Sistema de logging inteligente
 * Solo muestra logs en el panel de admin y en desarrollo
 */

const isAdminRoute = () => {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.startsWith('/admin');
};

const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

const shouldLog = () => {
  return isDevelopment() || isAdminRoute();
};

export const logger = {
  log: (...args: any[]) => {
    if (shouldLog()) {
      console.log(...args);
    }
  },
  
  error: (...args: any[]) => {
    if (shouldLog()) {
      console.error(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (shouldLog()) {
      console.warn(...args);
    }
  },
  
  info: (...args: any[]) => {
    if (shouldLog()) {
      console.info(...args);
    }
  },

  // Para errores críticos que siempre deben mostrarse
  critical: (...args: any[]) => {
    console.error('[CRITICAL]', ...args);
  },

  // Para logs específicos del admin
  admin: (...args: any[]) => {
    if (isAdminRoute() || isDevelopment()) {
      console.log('[ADMIN]', ...args);
    }
  },

  // Para logs públicos (solo en desarrollo)
  public: (...args: any[]) => {
    if (isDevelopment()) {
      console.log('[PUBLIC]', ...args);
    }
  }
}; 