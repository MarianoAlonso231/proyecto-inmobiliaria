'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  Heart
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface PropertyDetails {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  images: string[];
  type: 'venta' | 'alquiler';
  propertyType: string;
  description?: string;
  yearBuilt?: number;
  garage?: boolean;
  garden?: boolean;
  pool?: boolean;
  security?: boolean;
  gym?: boolean;
  wifi?: boolean;
  furnished?: boolean;
  pets?: boolean;
  features?: string[];
  address?: string;
  neighborhood?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

interface PropertyDetailsModalProps {
  property: PropertyDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyDetailsModal = ({ property, isOpen, onClose }: PropertyDetailsModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!property) return null;

  // Reset image index when property changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setIsLightboxOpen(false);
  }, [property.id]);

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

  // Use useCallback for handlers to prevent recreation
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  }, [property.images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  }, [property.images.length]);

  const openLightbox = useCallback(() => {
    setIsLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsLightboxOpen(false);
  }, []);

  // Handle modal close - prevent closing when lightbox is open
  const handleModalClose = useCallback((open: boolean) => {
    if (!open && !isLightboxOpen) {
      onClose();
    }
  }, [onClose, isLightboxOpen]);

  // Keyboard navigation for modal and lightbox
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen && !isLightboxOpen) return;
      
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
          if (isLightboxOpen) {
            setIsLightboxOpen(false);
          } else {
            onClose();
          }
          break;
      }
    };

    if (isLightboxOpen || isOpen) {
      document.addEventListener('keydown', handleKeyDown, true);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen, isLightboxOpen, nextImage, prevImage, onClose]);

  const amenityIcons = {
    garage: Car,
    garden: TreePine,
    pool: Waves,
    security: Shield,
    gym: Dumbbell,
    wifi: Wifi,
  };

  // Lightbox component with improved event handling
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
          src={property.images[currentImageIndex]} 
          alt={`${property.title} - Imagen ${currentImageIndex + 1}`}
          className="max-w-full max-h-full object-contain pointer-events-none select-none"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
          draggable={false}
        />
        
        {/* Botón cerrar - posición absoluta con z-index muy alto */}
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
        {property.images.length > 1 && (
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
            <div className="text-sm font-medium">{property.title}</div>
            <div className="text-xs text-gray-500">
              Imagen {currentImageIndex + 1} de {property.images.length}
            </div>
          </div>
        </div>
        
        {/* Thumbnails en lightbox */}
        {property.images.length > 1 && (
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {property.title}
                </DialogTitle>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{property.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={property.type === 'venta' ? 'default' : 'secondary'}
                    className={`${property.type === 'venta' ? 'bg-green-500' : 'bg-blue-500'} text-white`}
                  >
                    {property.type === 'venta' ? 'Venta' : 'Alquiler'}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-100 text-gray-900 border-gray-300">
                    {property.propertyType}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-400 mb-2">
                  {property.price}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Galería de imágenes mejorada */}
            <div className="relative">
              {/* Imagen principal */}
              <div 
                className="relative h-80 bg-gray-200 rounded-lg overflow-hidden mb-4 cursor-pointer group"
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
                      className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all ${
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
              
              {/* Indicador cuando solo hay una imagen */}
              {property.images.length === 1 && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  1 imagen disponible - Haz clic para ampliar
                </p>
              )}
              
              {/* Indicador para múltiples imágenes */}
              {property.images.length > 1 && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  <Maximize2 className="w-4 h-4 inline mr-1" />
                  Haz clic en la imagen para verla en pantalla completa
                </p>
              )}
            </div>

            {/* Información básica */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Bed className="w-5 h-5 text-primary-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-600">Dormitorios</div>
                  <div className="font-semibold">{property.bedrooms}</div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Bath className="w-5 h-5 text-primary-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-600">Baños</div>
                  <div className="font-semibold">{property.bathrooms}</div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Square className="w-5 h-5 text-primary-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-600">Superficie</div>
                  <div className="font-semibold">{property.area}</div>
                </div>
              </div>
              {property.yearBuilt && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-600">Año</div>
                    <div className="font-semibold">{property.yearBuilt}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Descripción */}
            {property.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            )}

            {/* Características */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Características</h3>
              {property.features && property.features.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                        className="flex items-center p-3 rounded-lg border bg-primary-50 border-primary-200 text-primary-700"
                      >
                        {IconComponent ? (
                          <IconComponent className="w-5 h-5 mr-2" />
                        ) : (
                          <div className="w-5 h-5 mr-2 flex items-center justify-center">
                            <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                          </div>
                        )}
                        <span className="text-sm font-medium">{displayName}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500">No hay características especificadas para esta propiedad</p>
                  <p className="text-xs text-gray-400 mt-1">Las características se pueden agregar desde el panel de administración</p>
                </div>
              )}
            </div>

            {/* Información de contacto */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de contacto</h3>
              <div className="space-y-3">
                {property.contactName && (
                  <div className="flex items-center">
                    <div className="text-sm text-gray-600 w-20">Agente:</div>
                    <div className="font-medium">{property.contactName}</div>
                  </div>
                )}
                {property.contactPhone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-primary-400 mr-2" />
                    <div className="text-sm text-gray-600 w-16">Teléfono:</div>
                    <div className="font-medium">{property.contactPhone}</div>
                  </div>
                )}
                {property.contactEmail && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-primary-400 mr-2" />
                    <div className="text-sm text-gray-600 w-16">Email:</div>
                    <div className="font-medium">{property.contactEmail}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1 bg-primary-400 hover:bg-primary-500 text-white">
                <Phone className="w-4 h-4 mr-2" />
                Contactar ahora
              </Button>
              <Button variant="outline" className="flex-1 border-primary-400 text-primary-400 hover:bg-primary-50">
                <Mail className="w-4 h-4 mr-2" />
                Enviar consulta
              </Button>
              <Button variant="outline" className="flex-1 border-primary-400 text-primary-400 hover:bg-primary-50">
                <Calendar className="w-4 h-4 mr-2" />
                Agendar visita
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      {isLightboxOpen && typeof window !== 'undefined' && 
        createPortal(<LightboxComponent />, document.body)
      }
    </>
  );
};

export default PropertyDetailsModal; 