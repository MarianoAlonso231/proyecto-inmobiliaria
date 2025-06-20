import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

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
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error al obtener sesión:', error);
          setAuthState({ user: null, loading: false, isAdmin: false });
          return;
        }

        if (session?.user) {
          const isAdmin = await checkAdminPermissions(session.user.email!);
          setAuthState({ 
            user: session.user, 
            loading: false, 
            isAdmin 
          });
        } else {
          setAuthState({ user: null, loading: false, isAdmin: false });
        }
      } catch (error) {
        console.error('Error inicial de autenticación:', error);
        setAuthState({ user: null, loading: false, isAdmin: false });
      }
    };

    getInitialSession();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT' || !session) {
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
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', email)
        .single();
      
      return !error && !!data;
    } catch (error) {
      console.error('Error al verificar permisos de admin:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error al cerrar sesión:', error);
      }
      setAuthState({ user: null, loading: false, isAdmin: false });
      router.push('/admin/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error al refrescar sesión:', error);
        await signOut();
      }
      return !error;
    } catch (error) {
      console.error('Error al refrescar sesión:', error);
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