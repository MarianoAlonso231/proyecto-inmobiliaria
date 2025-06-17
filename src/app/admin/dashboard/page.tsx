'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PropertyForm } from '@/components/PropertyForm';
import { StorageManager } from '@/components/admin/StorageManager';
import { StorageHealthWidget } from '@/components/admin/StorageHealthWidget';
import { useRouter } from 'next/navigation';
import { Loader2, Shield, AlertTriangle, Plus, Home, Building, DollarSign, MapPin, Edit, Trash2, Eye, Image, HardDrive } from 'lucide-react';
import { useProperties, PropertyFormData, initialFormData, Property } from '@/hooks/useProperties';
import { ImageItem } from '@/components/ImageUploaderDeferred';

interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [adminData, setAdminData] = useState<AdminUser | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Estado para el modal y formulario
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Hook personalizado para propiedades
  const { properties, isLoading: isLoadingProperties, error: propertiesError, stats, createProperty, updateProperty, deleteProperty, propertyToFormData, clearError } = useProperties();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // 1. Verificar usuario (método seguro)
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('No hay usuario válido:', userError);
          router.replace('/admin/login');
          return;
        }

        // 2. Verificar permisos de administrador
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', user.email)
          .single();

        if (adminError || !adminUser) {
          console.error('Usuario no es administrador:', adminError);
          await supabase.auth.signOut();
          router.replace('/admin/login');
          return;
        }

        // 3. Si todo está bien, establecer los datos
        setUser(user);
        setAdminData(adminUser);
        
      } catch (error) {
        console.error('Error al inicializar dashboard:', error);
        setError('Error al cargar el panel de administración');
        setTimeout(() => {
          router.replace('/admin/login');
        }, 2000);
      } finally {
        setIsPageLoading(false);
      }
    };

    initializeDashboard();

    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setAdminData(null);
        router.replace('/admin/login');
      } else if (event === 'SIGNED_IN' && session?.user) {
        try {
          // Verificar usuario de forma segura
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !user) {
            await supabase.auth.signOut();
            return;
          }

          const { data: adminUser, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', user.email)
            .single();

          if (error || !adminUser) {
            await supabase.auth.signOut();
            return;
          }

          setUser(user);
          setAdminData(adminUser);
        } catch (error) {
          console.error('Error al verificar permisos:', error);
          await supabase.auth.signOut();
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleInputChange = (field: keyof PropertyFormData, value: string | boolean | ImageItem[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingProperty(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsFormLoading(true);
      
      let success = false;
      if (editingProperty) {
        success = await updateProperty(editingProperty.id, formData);
      } else {
        success = await createProperty(formData);
      }

      if (success) {
        setIsDialogOpen(false);
        resetForm();
      }
      
    } catch (error) {
      console.error('Error al guardar propiedad:', error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData(propertyToFormData(property));
    setIsDialogOpen(true);
  };

  const handleDelete = async (propertyId: string, propertyTitle: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la propiedad "${propertyTitle}"?\n\nEsto eliminará tanto la propiedad como sus imágenes del Storage.`)) {
      return;
    }

    const success = await deleteProperty(propertyId);
    if (!success && propertiesError) {
      alert(propertiesError);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      
      // Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error al cerrar sesión:', error);
        setError('Error al cerrar sesión');
        setIsSigningOut(false);
        return;
      }

      // Forzar redirección al login después del logout exitoso
      router.push('/admin/login');
      
      // Opcionalmente, recargar la página para limpiar cualquier estado
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 100);
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setError('Error al cerrar sesión');
      setIsSigningOut(false);
    }
  };

  // Loading state
  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <Shield className="absolute inset-0 h-10 w-10 text-primary/20" />
          </div>
          <p className="text-sm text-gray-600 font-medium">Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertTriangle className="h-12 w-12 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Error de Acceso</h3>
                <p className="text-sm text-gray-600 mt-1">{error}</p>
              </div>
              <Button
                onClick={() => router.push('/admin/login')}
                className="w-full"
              >
                Volver al Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No access state (fallback)
  if (!user || !adminData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Acceso Denegado</h3>
              <p className="text-sm text-gray-600 mt-2">No tienes permisos para acceder a esta página</p>
              <Button
                className="mt-4 w-full"
                onClick={() => router.push('/admin/login')}
              >
                Ir al Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-sm text-gray-600">Sistema de gestión de propiedades inmobiliarias</p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              disabled={isSigningOut}
              variant="outline"
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 bg-white"
            >
              {isSigningOut ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cerrando...
                </>
              ) : (
                'Cerrar Sesión'
              )}
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
            >
              Resumen
            </TabsTrigger>
            <TabsTrigger 
              value="properties"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
            >
              Propiedades
            </TabsTrigger>
            <TabsTrigger 
              value="storage"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
            >
              <HardDrive className="w-4 h-4 mr-1" />
              Storage
            </TabsTrigger>
            <TabsTrigger 
              value="profile"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
            >
              Perfil
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="stats-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Propiedades</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Home className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="stats-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">En Venta</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.ventas}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="stats-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">En Alquiler</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.alquileres}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Building className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="stats-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Destacadas</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.destacadas}</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Eye className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white border border-green-200">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="p-2 bg-green-100 rounded-lg w-fit mx-auto mb-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <p className="text-sm font-medium text-green-700">Disponibles</p>
                    <p className="text-xl font-bold text-green-800">{stats.disponibles}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-red-200">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="p-2 bg-red-100 rounded-lg w-fit mx-auto mb-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                    <p className="text-sm font-medium text-red-700">Vendidas</p>
                    <p className="text-xl font-bold text-red-800">{stats.vendidas}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-blue-200">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="p-2 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                    <p className="text-sm font-medium text-blue-700">Alquiladas</p>
                    <p className="text-xl font-bold text-blue-800">{stats.alquiladas}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-yellow-200">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="p-2 bg-yellow-100 rounded-lg w-fit mx-auto mb-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    </div>
                    <p className="text-sm font-medium text-yellow-700">Reservadas</p>
                    <p className="text-xl font-bold text-yellow-800">{stats.reservadas}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Storage Health Widget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StorageHealthWidget onViewDetails={() => setActiveTab('storage')} />
              
              {/* Welcome Card */}
              <Card className="bg-white border border-gray-200 shadow-sm md:col-span-1">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  Bienvenido al Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Información del Administrador</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium text-gray-800">Email:</span> {adminData.email}</p>
                      {adminData.name && <p><span className="font-medium text-gray-800">Nombre:</span> {adminData.name}</p>}
                      {adminData.role && <p><span className="font-medium text-gray-800">Rol:</span> {adminData.role}</p>}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Estado de la Sesión</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Autenticado correctamente</span>
                      </div>
                      <p>Último acceso: {new Date().toLocaleString('es-ES')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Propiedades</h2>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm} className="flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-white">
                    <Plus className="h-4 w-4" />
                    Agregar Propiedad
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProperty ? 'Editar Propiedad' : 'Agregar Nueva Propiedad'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  {propertiesError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                      <p className="text-sm text-red-600">{propertiesError}</p>
                    </div>
                  )}

                  <PropertyForm
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                    isLoading={isFormLoading}
                    isEditing={!!editingProperty}
                    onCancel={() => setIsDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Properties List */}
            {isLoadingProperties ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : properties.length === 0 ? (
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-8 text-center">
                  <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                    <Home className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay propiedades</h3>
                  <p className="text-gray-600">Agrega tu primera propiedad para comenzar</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <Card key={property.id} className="overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      {/* Image placeholder */}
                      <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                        {property.images.length > 0 ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '';
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center text-gray-400">
                            <Image className="h-12 w-12 mb-2" />
                            <span className="text-sm">Sin imagen</span>
                          </div>
                        )}
                        
                        {property.featured && (
                          <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600 text-white border-0">
                            Destacada
                          </Badge>
                        )}
                        
                        <Badge 
                          className={`absolute top-2 right-2 border-0 text-white ${
                            property.status === 'disponible' ? 'bg-green-500 hover:bg-green-600' :
                            property.status === 'vendido' ? 'bg-red-500 hover:bg-red-600' :
                            property.status === 'alquilado' ? 'bg-blue-500 hover:bg-blue-600' :
                            'bg-yellow-500 hover:bg-yellow-600'
                          }`}
                        >
                          {property.status}
                        </Badge>
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 line-clamp-2">{property.title}</h3>
                          <div className="flex gap-1 ml-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(property)}
                              className="h-8 w-8 p-0 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(property.id, property.title)}
                              className="h-8 w-8 p-0 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-semibold text-gray-900">
                              {property.currency} {property.price.toLocaleString()}
                            </span>
                            <Badge variant="outline" className="ml-2 bg-gray-50 text-gray-700 border-gray-200">
                              {property.operation_type}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            <span>{property.property_type}</span>
                            {property.bedrooms > 0 && (
                              <span className="ml-2">{property.bedrooms} dorm.</span>
                            )}
                            {property.bathrooms > 0 && (
                              <span className="ml-1">{property.bathrooms} baños</span>
                            )}
                          </div>

                          {(property.address || property.neighborhood) && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span className="line-clamp-1">
                                {property.address}{property.address && property.neighborhood && ', '}{property.neighborhood}
                              </span>
                            </div>
                          )}

                          {property.construccion && (
                            <div className="text-xs text-gray-500">
                              Construcción: {property.construccion} m²
                            </div>
                          )}
                        </div>

                        {property.description && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {property.description}
                          </p>
                        )}

                        {property.features.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {property.features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                                {feature}
                              </Badge>
                            ))}
                            {property.features.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                +{property.features.length - 3} más
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-100">
                          Creada: {new Date(property.created_at).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Storage Tab */}
          <TabsContent value="storage" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Gestión de Storage de Imágenes</h2>
              <p className="text-sm text-gray-600">
                Administra las imágenes del bucket de Supabase, identifica y limpia archivos huérfanos
              </p>
            </div>
            <StorageManager />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle>Información del Perfil</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700 font-medium">Email</Label>
                    <Input value={adminData.email} disabled className="mt-1 bg-gray-50 border-gray-200" />
                  </div>
                  {adminData.name && (
                    <div>
                      <Label className="text-gray-700 font-medium">Nombre</Label>
                      <Input value={adminData.name} disabled className="mt-1 bg-gray-50 border-gray-200" />
                    </div>
                  )}
                  {adminData.role && (
                    <div>
                      <Label className="text-gray-700 font-medium">Rol</Label>
                      <Input value={adminData.role} disabled className="mt-1 bg-gray-50 border-gray-200" />
                    </div>
                  )}
                  <div>
                    <Label className="text-gray-700 font-medium">Fecha de Registro</Label>
                    <Input value={new Date(adminData.created_at).toLocaleString('es-ES')} disabled className="mt-1 bg-gray-50 border-gray-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}