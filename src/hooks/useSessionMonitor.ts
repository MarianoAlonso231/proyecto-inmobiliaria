import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface SessionStatus {
  isValid: boolean;
  expiresIn: number; // segundos hasta expiración
  isNearExpiry: boolean; // true si expira en menos de 5 minutos
  lastActivity: number; // timestamp de última actividad
}

export function useSessionMonitor() {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>({
    isValid: false,
    expiresIn: 0,
    isNearExpiry: false,
    lastActivity: Date.now()
  });
  
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);

  // Función para actualizar la última actividad
  const updateActivity = useCallback(() => {
    setSessionStatus(prev => ({
      ...prev,
      lastActivity: Date.now()
    }));
  }, []);

  // Función para verificar el estado de la sesión
  const checkSessionStatus = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        setSessionStatus(prev => ({
          ...prev,
          isValid: false,
          expiresIn: 0,
          isNearExpiry: false
        }));
        return false;
      }

      const now = Math.floor(Date.now() / 1000);
      const expiresAt = session.expires_at || 0;
      const expiresIn = expiresAt - now;
      const isNearExpiry = expiresIn < 300; // menos de 5 minutos

      setSessionStatus(prev => ({
        ...prev,
        isValid: true,
        expiresIn,
        isNearExpiry
      }));

      // Mostrar advertencia si está próxima a expirar
      if (isNearExpiry && expiresIn > 0) {
        setShowExpiryWarning(true);
      }

      return true;
    } catch (error) {
      console.error('Error al verificar sesión:', error);
      return false;
    }
  }, []);

  // Función para renovar la sesión
  const refreshSession = useCallback(async () => {
    try {
      console.log('🔄 Renovando sesión automáticamente...');
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error || !data.session) {
        console.error('❌ Error al renovar sesión:', error);
        return false;
      }
      
      console.log('✅ Sesión renovada exitosamente');
      setShowExpiryWarning(false);
      await checkSessionStatus();
      return true;
    } catch (error) {
      console.error('❌ Error crítico al renovar sesión:', error);
      return false;
    }
  }, [checkSessionStatus]);

  // Escuchadores de actividad del usuario
  useEffect(() => {
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
    };

    // Agregar listeners para detectar actividad
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [updateActivity]);

  // Verificar sesión periódicamente
  useEffect(() => {
    // Verificación inicial
    checkSessionStatus();

    // Verificar cada 30 segundos
    const interval = setInterval(() => {
      // Verificar si el componente sigue montado antes de ejecutar
      checkSessionStatus().catch(console.error);
    }, 30000);

    return () => {
      clearInterval(interval);
      console.log('🧹 Limpiando interval de monitoreo de sesión');
    };
  }, [checkSessionStatus]);

  // Auto-renovar sesión cuando esté próxima a expirar
  useEffect(() => {
    if (sessionStatus.isNearExpiry && sessionStatus.isValid) {
      const timeSinceLastActivity = Date.now() - sessionStatus.lastActivity;
      const inactiveForMinutes = timeSinceLastActivity / (1000 * 60);
      
      // Si el usuario ha estado activo en los últimos 10 minutos, renovar automáticamente
      if (inactiveForMinutes < 10) {
        refreshSession();
      }
    }
  }, [sessionStatus.isNearExpiry, sessionStatus.isValid, sessionStatus.lastActivity, refreshSession]);

  return {
    sessionStatus,
    showExpiryWarning,
    refreshSession,
    checkSessionStatus,
    dismissWarning: () => setShowExpiryWarning(false)
  };
} 