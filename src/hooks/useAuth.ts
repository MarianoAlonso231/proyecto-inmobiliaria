import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/logger';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false
  });
  const router = useRouter();

  useEffect(() => {
    // Obtener sesión inicial con timeout
    const getInitialSession = async () => {
      try {
        logger.admin('🔐 Obteniendo sesión inicial...');
        
        // Timeout de 10 segundos para getSession inicial
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout al obtener sesión inicial')), 10000)
        );
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise, 
          timeoutPromise
        ]) as any;
        
        if (error) {
          logger.error('❌ Error al obtener sesión:', error);
          setAuthState({ user: null, loading: false, isAdmin: false });
          return;
        }

        if (session?.user) {
          logger.admin('✅ Sesión inicial encontrada para:', session.user.email);
          const isAdmin = await checkAdminPermissions(session.user.email!);
          setAuthState({ 
            user: session.user, 
            loading: false, 
            isAdmin 
          });
        } else {
          logger.admin('ℹ️ No hay sesión inicial activa');
          setAuthState({ user: null, loading: false, isAdmin: false });
        }
      } catch (error) {
        logger.error('❌ Error inicial de autenticación:', error);
        setAuthState({ user: null, loading: false, isAdmin: false });
      }
    };

    getInitialSession();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Logging mejorado de eventos de autenticación
        logger.admin('Auth event:', event, session?.expires_at);
        logger.admin('Usuario:', session?.user?.email);
        
        if (event === 'TOKEN_REFRESHED') {
          logger.admin('Token renovado exitosamente');
        }
        
        if (event === 'SIGNED_OUT') {
          logger.admin('Sesión cerrada - razón desconocida');
          setAuthState({ user: null, loading: false, isAdmin: false });
          return;
        }

        if (!session) {
          setAuthState({ user: null, loading: false, isAdmin: false });
          return;
        }

        if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
          const isAdmin = await checkAdminPermissions(session.user.email!);
          setAuthState({ 
            user: session.user, 
            loading: false, 
            isAdmin 
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminPermissions = async (email: string): Promise<boolean> => {
    try {
      logger.admin('🔍 Verificando permisos de admin para:', email);
      
      // Timeout de 8 segundos para consulta de admin
      const adminPromise = supabase
        .from('admin_users')
        .select('id')
        .eq('email', email)
        .single();
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout al verificar permisos de admin')), 8000)
      );
      
      const { data, error } = await Promise.race([
        adminPromise, 
        timeoutPromise
      ]) as any;
      
      const isAdmin = !error && !!data;
      logger.admin(isAdmin ? '✅ Usuario es admin' : 'ℹ️ Usuario no es admin');
      
      return isAdmin;
    } catch (error) {
      logger.error('❌ Error al verificar permisos de admin:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      logger.admin('🚪 Cerrando sesión...');
      
      // Timeout de 10 segundos para signOut
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout al cerrar sesión')), 10000)
      );
      
      const { error } = await Promise.race([
        signOutPromise, 
        timeoutPromise
      ]) as any;
      
      if (error) {
        logger.error('❌ Error al cerrar sesión:', error);
      } else {
        logger.admin('✅ Sesión cerrada exitosamente');
      }
      
      setAuthState({ user: null, loading: false, isAdmin: false });
      router.push('/admin/login');
    } catch (error) {
      logger.error('❌ Error crítico al cerrar sesión:', error);
      // Aún así limpiamos el estado local
      setAuthState({ user: null, loading: false, isAdmin: false });
      router.push('/admin/login');
    }
  };

  const refreshSession = async () => {
    try {
      logger.admin('🔄 Renovando sesión...');
      
      // Timeout de 15 segundos para refreshSession
      const refreshPromise = supabase.auth.refreshSession();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout al renovar sesión')), 15000)
      );
      
      const { data, error } = await Promise.race([
        refreshPromise, 
        timeoutPromise
      ]) as any;
      
      if (error) {
        logger.error('❌ Error al refrescar sesión:', error);
        await signOut();
        return false;
      }
      
      logger.admin('✅ Sesión renovada exitosamente');
      return true;
    } catch (error) {
      logger.error('❌ Error crítico al refrescar sesión:', error);
      await signOut();
      return false;
    }
  };

  return {
    ...authState,
    signOut,
    refreshSession
  };
} 