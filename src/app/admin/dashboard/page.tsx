'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.replace('/admin/login');
          return;
        }
        setUser(session.user);
      } catch (error) {
        console.error('Error al obtener la sesión:', error);
        router.replace('/admin/login');
      } finally {
        setIsPageLoading(false);
      }
    };

    getUser();

    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/admin/login');
      } else if (session?.user) {
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      // La redirección se manejará automáticamente por el listener de onAuthStateChange
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-gray-500">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">No tienes acceso a esta página</p>
          <Button
            className="mt-4"
            onClick={() => router.push('/admin/login')}
          >
            Ir al login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Panel de Administración</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Bienvenido, {user?.email}</h2>
              <p className="text-gray-600">Panel de control de administrador</p>
            </div>
            
            {/* Aquí puedes agregar más secciones del dashboard según necesites */}
            
            <div className="flex justify-end">
              <Button
                onClick={handleSignOut}
                variant="destructive"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cerrando sesión...
                  </>
                ) : (
                  'Cerrar Sesión'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 