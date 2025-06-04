'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Phone, 
  Mail, 
  Calendar,
  Building,
  Car,
  Wifi,
  Shield,
  TreePine,
  Dumbbell,
  Waves,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Heart,
  ArrowLeft
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useProperties } from '@/hooks/useProperties';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { properties, isLoading } = useProperties();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Encontrar la propiedad por ID
  const property = properties.find(p => p.id === params.id);

  // Reset image index when property changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setIsLightboxOpen(false);
  }, [params.id]);

  // Block body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen]);

  const nextImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
  };

  const closeLightbox = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsLightboxOpen(false);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          event.stopPropagation();
          prevImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          event.stopPropagation();
          nextImage();
          break;
        case 'Escape':
          event.preventDefault();
          event.stopPropagation();
          setIsLightboxOpen(false);
          break;
      }
    };

    if (isLightboxOpen) {
      document.addEventListener('keydown', handleKeyDown, true);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isLightboxOpen]);

  // Función para formatear el precio
  const formatPrice = (price: number, currency: string) => {
    return `${currency} ${price.toLocaleString()}`;
  };

  // Función para formatear la ubicación
  const formatLocation = (address: string, neighborhood: string) => {
    if (address && neighborhood) {
      return `${neighborhood} - ${address}`;
    }
    return neighborhood || address || 'Ubicación no especificada';
  };

  // Lightbox component
  const LightboxComponent = () => (
    <div 
      className="fixed inset-0 bg-gray-100 flex items-center justify-center"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        zIndex: 99999
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        closeLightbox();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }}
    >
      {/* Contenedor de la imagen */}
      <div 
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        style={{ zIndex: 100000 }}
      >
        <img 
          src={property?.images[currentImageIndex]} 
          alt={`${property?.title} - Imagen ${currentImageIndex + 1}`}
          className="max-w-full max-h-full object-contain pointer-events-none select-none"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
          draggable={false}
        />
        
        {/* Botón cerrar */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            closeLightbox();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}
          className="fixed top-6 right-6 p-4 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-200 border border-gray-200 cursor-pointer"
          style={{ 
            zIndex: 100001,
            pointerEvents: 'auto'
          }}
          aria-label="Cerrar lightbox"
        >
          <X className="w-6 h-6 pointer-events-none" />
        </button>
        
        {/* Navegación en lightbox */}
        {property && property.images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                prevImage();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }}
              className="fixed left-6 top-1/2 transform -translate-y-1/2 p-4 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-200 border border-gray-200 cursor-pointer"
              style={{ 
                zIndex: 100001,
                pointerEvents: 'auto'
              }}
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-6 h-6 pointer-events-none" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                nextImage();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }}
              className="fixed right-6 top-1/2 transform -translate-y-1/2 p-4 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-200 border border-gray-200 cursor-pointer"
              style={{ 
                zIndex: 100001,
                pointerEvents: 'auto'
              }}
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-6 h-6 pointer-events-none" />
            </button>
          </>
        )}
        
        {/* Información de la imagen en lightbox */}
        <div 
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-100 text-gray-700 px-6 py-3 rounded-full border border-gray-200 pointer-events-none select-none"
          style={{ zIndex: 100001 }}
        >
          <div className="text-center">
            <div className="text-sm font-medium">{property?.title}</div>
            <div className="text-xs text-gray-500">
              Imagen {currentImageIndex + 1} de {property?.images.length}
            </div>
          </div>
        </div>
        
        {/* Thumbnails en lightbox */}
        {property && property.images.length > 1 && (
          <div 
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto bg-gray-100 p-3 rounded-lg border border-gray-200"
            style={{ zIndex: 100001 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
          >
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  setCurrentImageIndex(index);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                }}
                className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all hover:scale-105 cursor-pointer ${
                  index === currentImageIndex 
                    ? 'border-gray-300 ring-2 ring-gray-300' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ pointerEvents: 'auto' }}
              >
                <img 
                  src={image} 
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover pointer-events-none select-none"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                  draggable={false}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
            <p className="text-gray-600">Cargando propiedad...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Property not found
  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Propiedad no encontrada</h1>
            <p className="text-gray-600 mb-8">La propiedad que buscas no existe o ha sido eliminada.</p>
            <Button 
              onClick={() => router.push('/')}
              className="bg-primary-400 hover:bg-primary-500 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botón de volver */}
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-6 bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Header de la propiedad */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-lg">{formatLocation(property.address, property.neighborhood)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={property.operation_type === 'venta' ? 'default' : 'secondary'}
                    className={`${property.operation_type === 'venta' ? 'bg-green-500' : 'bg-blue-500'} text-white text-base px-4 py-2`}
                  >
                    {property.operation_type === 'venta' ? 'Venta' : 'Alquiler'}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-100 text-gray-900 border-gray-300 text-base px-4 py-2">
                    {property.property_type}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-4">
                  {formatPrice(property.price, property.currency)}
                </div>
              </div>
            </div>

            {/* Galería de imágenes */}
            <div className="mb-8">
              {property.images && property.images.length > 0 ? (
                <div className="relative">
                  {/* Imagen principal */}
                  <div 
                    className="relative h-96 md:h-[500px] bg-gray-200 rounded-lg overflow-hidden mb-4 cursor-pointer group"
                    onClick={openLightbox}
                  >
                    <img 
                      src={property.images[currentImageIndex]} 
                      alt={`${property.title} - Imagen ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    
                    {/* Overlay para indicar que es clicable */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                        <Maximize2 className="w-6 h-6 text-gray-700" />
                      </div>
                    </div>
                    
                    {/* Navegación de imágenes */}
                    {property.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                          }}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-all duration-200 backdrop-blur-sm"
                          aria-label="Imagen anterior"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                          }}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-all duration-200 backdrop-blur-sm"
                          aria-label="Imagen siguiente"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        
                        {/* Contador de imágenes */}
                        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                          {currentImageIndex + 1} / {property.images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {property.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {property.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          onDoubleClick={() => {
                            setCurrentImageIndex(index);
                            openLightbox();
                          }}
                          className={`flex-shrink-0 w-24 h-18 rounded-md overflow-hidden border-2 transition-all ${
                            index === currentImageIndex 
                              ? 'border-primary-400 ring-2 ring-primary-200' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          title="Clic para cambiar imagen, doble clic para ver en pantalla completa"
                        >
                          <img 
                            src={image} 
                            alt={`${property.title} - Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Indicador para múltiples imágenes */}
                  {property.images.length > 1 && (
                    <p className="text-center text-sm text-gray-500 mt-2">
                      <Maximize2 className="w-4 h-4 inline mr-1" />
                      Haz clic en la imagen para verla en pantalla completa
                    </p>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No hay imágenes disponibles</p>
                </div>
              )}
            </div>

            {/* Información básica */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Bed className="w-6 h-6 text-primary-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">Dormitorios</div>
                  <div className="text-xl font-semibold">{property.bedrooms}</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Bath className="w-6 h-6 text-primary-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">Baños</div>
                  <div className="text-xl font-semibold">{property.bathrooms}</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Square className="w-6 h-6 text-primary-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">Superficie</div>
                  <div className="text-xl font-semibold">{property.area_m2 ? `${property.area_m2}m²` : 'N/A'}</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-6 h-6 text-primary-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">Año</div>
                  <div className="text-xl font-semibold">2020</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Descripción */}
                {property.description && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Descripción</h2>
                    <p className="text-gray-600 leading-relaxed text-lg">{property.description}</p>
                  </div>
                )}

                {/* Características */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Características</h2>
                  {property.features && property.features.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {property.features.map((feature, index) => {
                        const featureLower = feature.toLowerCase();
                        
                        // Mapeo de características a iconos
                        let IconComponent = null;
                        let displayName = feature;
                        
                        if (featureLower.includes('garage') || featureLower.includes('garaje')) {
                          IconComponent = Car;
                          displayName = 'Garaje';
                        } else if (featureLower.includes('jardín') || featureLower.includes('jardin') || featureLower.includes('garden')) {
                          IconComponent = TreePine;
                          displayName = 'Jardín';
                        } else if (featureLower.includes('piscina') || featureLower.includes('pool')) {
                          IconComponent = Waves;
                          displayName = 'Piscina';
                        } else if (featureLower.includes('seguridad') || featureLower.includes('security')) {
                          IconComponent = Shield;
                          displayName = 'Seguridad';
                        } else if (featureLower.includes('gimnasio') || featureLower.includes('gym')) {
                          IconComponent = Dumbbell;
                          displayName = 'Gimnasio';
                        } else if (featureLower.includes('wifi') || featureLower.includes('internet')) {
                          IconComponent = Wifi;
                          displayName = 'WiFi';
                        } else if (featureLower.includes('amueblado') || featureLower.includes('furnished')) {
                          IconComponent = Building;
                          displayName = 'Amueblado';
                        } else if (featureLower.includes('mascotas') || featureLower.includes('pets')) {
                          IconComponent = Heart;
                          displayName = 'Se aceptan mascotas';
                        }

                        return (
                          <div
                            key={index}
                            className="flex items-center p-4 rounded-lg border bg-primary-50 border-primary-200 text-primary-700"
                          >
                            {IconComponent ? (
                              <IconComponent className="w-5 h-5 mr-3" />
                            ) : (
                              <div className="w-5 h-5 mr-3 flex items-center justify-center">
                                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                              </div>
                            )}
                            <span className="font-medium">{displayName}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-500">No hay características especificadas para esta propiedad</p>
                    </div>
                  )}
                </div>

                {/* Ubicación */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ubicación</h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    {/* Dirección completa */}
                    <div className="mb-4">
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-primary-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-gray-900 font-medium">
                            {[property.address, property.neighborhood, property.city, property.province, property.country]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Mapa */}
                    <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <iframe
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                          [property.address, property.neighborhood, property.city, property.province, property.country]
                            .filter(Boolean)
                            .join(', ')
                        )}&output=embed`}
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Ubicación de ${property.title}`}
                        className="w-full h-80 rounded-lg"
                      />
                    </div>
                    
                    {/* Enlace a Google Maps */}
                    <div className="mt-3 text-center">
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(
                          [property.address, property.neighborhood, property.city, property.province, property.country]
                            .filter(Boolean)
                            .join(', ')
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary-400 hover:text-primary-500 text-sm font-medium transition-colors"
                      >
                        <MapPin className="w-4 h-4 mr-1" />
                        Ver en Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de contacto */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg sticky top-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Información de contacto</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-600 w-20">Agente:</div>
                      <div className="font-medium">María González</div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-primary-400 mr-2" />
                      <div className="text-sm text-gray-600 w-16">Teléfono:</div>
                      <div className="font-medium">+54 381 506-3361</div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-primary-400 mr-2" />
                      <div className="text-sm text-gray-600 w-16">Email:</div>
                      <div className="font-medium">info@inmobi.com</div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="space-y-3">
                    <Button 
                      onClick={() => {
                        const propertyAddress = [property.address, property.neighborhood, property.city, property.province]
                          .filter(Boolean)
                          .join(', ');
                        
                        const message = `Hola! Me interesa la propiedad "${property.title}" ubicada en ${propertyAddress}. ¿Podrían brindarme más información? Gracias.`;
                        
                        const whatsappUrl = `https://wa.me/5493816080780?text=${encodeURIComponent(message)}`;
                        
                        window.open(whatsappUrl, '_blank');
                      }}
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      Consultar por WhatsApp
                    </Button>
                    <Button variant="outline" className="w-full border-primary-400 text-primary-400 hover:bg-primary-50">
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar consulta
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Lightbox */}
      {isLightboxOpen && typeof window !== 'undefined' && 
        createPortal(<LightboxComponent />, document.body)
      }
    </div>
  );
} 