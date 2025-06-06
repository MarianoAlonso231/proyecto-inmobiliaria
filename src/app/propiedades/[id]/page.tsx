'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  ArrowLeft,
  User,
  MessageSquare
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
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

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

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí implementarías la lógica de envío del formulario
    console.log('Enviando formulario:', contactForm);
    alert('¡Gracias! Tu consulta ha sido enviada. Te contactaremos pronto.');
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };

  // Lightbox component
  const LightboxComponent = () => (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]"
      onClick={closeLightbox}
    >
      <div 
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={property?.images[currentImageIndex]} 
          alt={`${property?.title} - Imagen ${currentImageIndex + 1}`}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        
        {/* Botón cerrar */}
        <button
          onClick={closeLightbox}
          className="absolute top-4 right-4 p-2 bg-white/90 text-black rounded-full hover:bg-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Navegación */}
        {property && property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 text-black rounded-full hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 text-black rounded-full hover:bg-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
        
        {/* Contador */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full">
          {currentImageIndex + 1} / {property?.images.length}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-400" />
            <p className="text-gray-600">Cargando propiedad...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Propiedad no encontrada</h1>
            <p className="text-gray-600 mb-6">La propiedad que buscas no existe o ha sido eliminada.</p>
            <Button 
              onClick={() => router.back()}
              className="bg-primary-400 hover:bg-primary-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver atrás
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna izquierda - Contenido principal */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Título y precio */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-lg">{property.neighborhood || property.address || 'Ubicación no especificada'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={property.operation_type === 'venta' ? 'default' : 'secondary'}
                    className={`text-sm px-3 py-1 ${
                      property.operation_type === 'venta' 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                  >
                    En {property.operation_type}
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1 bg-gray-100 text-gray-900 border-gray-300">
                    {property.property_type}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-[#ff8425] text-white px-6 py-4 rounded-lg shadow-lg inline-block">
                  <div className="text-3xl font-bold mb-1">
                    {property.currency} {property.price.toLocaleString()}
                  </div>
                  <div className="text-sm opacity-90">
                    {property.operation_type === 'venta' ? 'Precio de venta' : 'Precio de alquiler'}
                  </div>
                </div>
              </div>
            </div>

            {/* Galería de imágenes */}
            <div className="space-y-4">
              {/* Imagen principal */}
              <div 
                className="relative h-96 bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
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
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                    <Maximize2 className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
                
                {/* Navegación */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors backdrop-blur-sm"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors backdrop-blur-sm"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    
                    {/* Contador */}
                    <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {property.images.length > 1 && (
                <div className="grid grid-cols-6 gap-2">
                  {property.images.slice(0, 6).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                        index === currentImageIndex 
                          ? 'border-primary-400 ring-2 ring-primary-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      {index === 5 && property.images.length > 6 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium">
                          +{property.images.length - 6}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información básica */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Características principales</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bed className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Dormitorios</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bath className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Baños</div>
                </div>
                                 <div className="text-center p-4 bg-gray-50 rounded-lg">
                   <Square className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                   <div className="text-2xl font-bold text-gray-900">{property.area_m2 || 'N/A'}</div>
                   <div className="text-sm text-gray-600">m² Totales</div>
                 </div>
                 <div className="text-center p-4 bg-gray-50 rounded-lg">
                   <Building className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                   <div className="text-2xl font-bold text-gray-900">{property.lot_area_m2 || property.area_m2 || 'N/A'}</div>
                   <div className="text-sm text-gray-600">m² Cubiertos</div>
                 </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción de la Propiedad</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {property.description || 'Hermosa casa en alquiler temporario (Estancia Mínima 3 noches) para 6 personas compuesta por: Galería cubierta, Living comedor, Cocina con mesada y bajo mesada, Baño completo, Asador, Dos dormitorios. Uno con cama matrimonial y el otro con cuatro camas individuales.'}
                </p>
              </div>
            </div>

            {/* Características y amenidades */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Características</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.features && property.features.length > 0 ? (
                  property.features.map((feature, index) => {
                    let IconComponent = Building;
                    const featureLower = feature.toLowerCase();
                    
                    if (featureLower.includes('garage') || featureLower.includes('garaje')) {
                      IconComponent = Car;
                    } else if (featureLower.includes('jardín') || featureLower.includes('jardin')) {
                      IconComponent = TreePine;
                    } else if (featureLower.includes('piscina')) {
                      IconComponent = Waves;
                    } else if (featureLower.includes('seguridad')) {
                      IconComponent = Shield;
                    } else if (featureLower.includes('gimnasio')) {
                      IconComponent = Dumbbell;
                    } else if (featureLower.includes('wifi')) {
                      IconComponent = Wifi;
                    }

                    return (
                      <div key={index} className="flex items-center p-3 bg-primary-50 border border-primary-200 rounded-lg">
                        <IconComponent className="w-5 h-5 text-primary-600 mr-3" />
                        <span className="text-sm font-medium text-primary-700">{feature}</span>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="flex items-center p-3 bg-primary-50 border border-primary-200 rounded-lg">
                      <Car className="w-5 h-5 text-primary-600 mr-3" />
                      <span className="text-sm font-medium text-primary-700">Garaje</span>
                    </div>
                    <div className="flex items-center p-3 bg-primary-50 border border-primary-200 rounded-lg">
                      <TreePine className="w-5 h-5 text-primary-600 mr-3" />
                      <span className="text-sm font-medium text-primary-700">Jardín</span>
                    </div>
                    <div className="flex items-center p-3 bg-primary-50 border border-primary-200 rounded-lg">
                      <Wifi className="w-5 h-5 text-primary-600 mr-3" />
                      <span className="text-sm font-medium text-primary-700">WiFi</span>
                    </div>
                    <div className="flex items-center p-3 bg-primary-50 border border-primary-200 rounded-lg">
                      <Shield className="w-5 h-5 text-primary-600 mr-3" />
                      <span className="text-sm font-medium text-primary-700">Seguridad</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Columna derecha - Mapa y contacto */}
          <div className="space-y-6">
            
            {/* Ubicación y mapa */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ubicación</h3>
                                 <div className="flex items-center text-gray-600">
                   <MapPin className="w-4 h-4 mr-2" />
                   <span className="text-sm">{property.address || property.neighborhood || 'Ubicación no especificada'}</span>
                 </div>
              </div>
              
                             {/* Mapa interactivo */}
               <div className="h-64 bg-gray-100 relative overflow-hidden">
                 <div className="absolute inset-0">
                   <iframe
                     src={`https://www.google.com/maps?q=${encodeURIComponent(
                       `${property.address || ''} ${property.neighborhood || ''} ${property.city || ''} ${property.province || ''}`
                     )}&output=embed`}
                     width="100%"
                     height="100%"
                     style={{ border: 0 }}
                     allowFullScreen
                     loading="lazy"
                     referrerPolicy="no-referrer-when-downgrade"
                     title={`Ubicación de ${property.title}`}
                     className="w-full h-full"
                   />
                 </div>
                 
                 {/* Enlace para abrir en Google Maps */}
                 <div className="absolute bottom-2 right-2">
                   <a
                     href={`https://www.google.com/maps/search/${encodeURIComponent(
                       `${property.address || ''} ${property.neighborhood || ''} ${property.city || ''} ${property.province || ''}`
                     )}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-flex items-center bg-white/90 hover:bg-white text-gray-700 text-xs px-2 py-1 rounded shadow-md transition-colors"
                   >
                     <MapPin className="w-3 h-3 mr-1" />
                     Ver en Google Maps
                   </a>
                 </div>
               </div>
            </div>

            {/* Información del agente */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Silvino Hilt</h3>
                  <p className="text-sm text-gray-600">Agente inmobiliario</p>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    Conectado
                  </div>
                </div>
              </div>
              
                             <div className="space-y-3 mb-4">
                 <div className="flex items-center text-sm text-gray-600">
                   <Phone className="w-4 h-4 mr-2" />
                   <span>+54 381 506-3361</span>
                 </div>
                 <div className="flex items-center text-sm text-gray-600">
                   <Mail className="w-4 h-4 mr-2" />
                   <span>info@inmobiliaria.com</span>
                 </div>
               </div>

              <Button className="w-full bg-primary-400 hover:bg-primary-500 text-white mb-3">
                <Phone className="w-4 h-4 mr-2" />
                Llamar ahora
              </Button>
              <Button variant="outline" className="w-full border-primary-400 text-primary-400 hover:bg-primary-50">
                <MessageSquare className="w-4 h-4 mr-2" />
                Enviar WhatsApp
              </Button>
            </div>

            {/* Formulario de contacto */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contactar agente
              </h3>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Ingrese su Nombre"
                    value={contactForm.name}
                    onChange={handleContactFormChange}
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Ingrese su Email"
                    value={contactForm.email}
                    onChange={handleContactFormChange}
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="Teléfono"
                    value={contactForm.phone}
                    onChange={handleContactFormChange}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Textarea
                    name="message"
                    placeholder="Hola, me interesa esta propiedad y quiero que me contacten. Gracias."
                    value={contactForm.message}
                    onChange={handleContactFormChange}
                    rows={4}
                    className="w-full resize-none"
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-primary-400 hover:bg-primary-500 text-white"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Mensaje
                </Button>
              </form>
            </div>

            {/* Botón de visita */}
            <div className="bg-white border rounded-lg p-6">
              <Button 
                variant="outline" 
                className="w-full border-primary-400 text-primary-400 hover:bg-primary-50"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Visita
              </Button>
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