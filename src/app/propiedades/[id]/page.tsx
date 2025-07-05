'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  MessageSquare,
  DollarSign
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useProperties } from '@/hooks/useProperties';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import { formatPropertyType, getPropertyArea } from '@/lib/utils';

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

  const handleWhatsAppClick = () => {
    if (!property) return;
    
    let characteristicsText = '';
    
    if (property.property_type === 'terreno') {
      const characteristics = [];
      if (property.barrio_cerrado) characteristics.push('Barrio Cerrado');
      if (property.es_country) characteristics.push('Country Club');
      if (property.paga_expensas) characteristics.push('Paga Expensas');
      
      characteristicsText = `🏠 Características:
• Tipo: ${formatPropertyType(property.property_type)}
• ${getPropertyArea(property.property_type, property.construccion, property.terreno)}
• Ubicación: ${property.neighborhood || property.address || 'Ubicación no especificada'}${characteristics.length > 0 ? `
• Características especiales: ${characteristics.join(', ')}` : ''}`;
    } else if (property.property_type === 'local') {
      const characteristics = [];
      if (property.paga_expensas) characteristics.push('Paga Expensas');
      
      characteristicsText = `🏠 Características:
• Tipo: ${formatPropertyType(property.property_type)}
• ${getPropertyArea(property.property_type, property.construccion, property.terreno)}
• Ubicación: ${property.neighborhood || property.address || 'Ubicación no especificada'}${characteristics.length > 0 ? `
• Características especiales: ${characteristics.join(', ')}` : ''}`;
    } else if (property.property_type === 'oficina') {
      const characteristics = [];
      if (property.paga_expensas) characteristics.push('Paga Expensas');
      
      characteristicsText = `🏠 Características:
• Tipo: ${formatPropertyType(property.property_type)}
• ${getPropertyArea(property.property_type, property.construccion, property.terreno)}
• ${property.bathrooms} baños
• Ubicación: ${property.neighborhood || property.address || 'Ubicación no especificada'}${characteristics.length > 0 ? `
• Características especiales: ${characteristics.join(', ')}` : ''}`;
    } else if (property.property_type === 'casa') {
      const characteristics = [];
      if (property.paga_expensas) characteristics.push('Paga Expensas');
      if (property.barrio_cerrado) characteristics.push('Barrio Privado');
      if (property.es_country) characteristics.push('Country Club');
      
      characteristicsText = `🏠 Características:
• Tipo: ${formatPropertyType(property.property_type)}
• ${property.bedrooms} dormitorios
• ${property.bathrooms} baños
• ${getPropertyArea(property.property_type, property.construccion, property.terreno)}
• Ubicación: ${property.neighborhood || property.address || 'Ubicación no especificada'}${characteristics.length > 0 ? `
• Características especiales: ${characteristics.join(', ')}` : ''}`;
    } else if (property.property_type === 'apartamento') {
      const characteristics = [];
      if (property.paga_expensas) characteristics.push('Paga Expensas');
      
      characteristicsText = `🏠 Características:
• Tipo: ${formatPropertyType(property.property_type)}
• ${property.bedrooms} dormitorios
• ${property.bathrooms} baños
• ${getPropertyArea(property.property_type, property.construccion, property.terreno)}
• Ubicación: ${property.neighborhood || property.address || 'Ubicación no especificada'}${characteristics.length > 0 ? `
• Características especiales: ${characteristics.join(', ')}` : ''}`;
    } else if (property.property_type === 'estacionamiento') {
      const characteristics = [];
      if (property.cubierto) characteristics.push('Cubierto');
      if (property.capacidad && property.capacidad > 1) characteristics.push(`Capacidad: ${property.capacidad} autos`);
      
      characteristicsText = `🚗 Características del Estacionamiento:
• Tipo: ${formatPropertyType(property.property_type)}
• ${getPropertyArea(property.property_type, property.construccion, property.terreno)}
• ${property.cubierto ? 'Cubierto (Techado)' : 'Descubierto'}
• Capacidad: ${property.capacidad || 1} auto${(property.capacidad || 1) > 1 ? 's' : ''}
• Ubicación: ${property.neighborhood || property.address || 'Ubicación no especificada'}${characteristics.length > 0 ? `
• Características especiales: ${characteristics.join(', ')}` : ''}`;
    } else {
      characteristicsText = `🏠 Características:
• ${property.bedrooms} dormitorios
• ${property.bathrooms} baños
• ${getPropertyArea(property.property_type, property.construccion, property.terreno)}
• Ubicación: ${property.neighborhood || property.address || 'Ubicación no especificada'}`;
    }

    // Agregar ubicación precisa si hay coordenadas disponibles
    const locationText = property.latitude && property.longitude 
      ? `📍 Ubicación exacta: https://www.google.com/maps?q=${property.latitude},${property.longitude}`
      : '';

    const message = `¡Hola! Me interesa la propiedad "${property.title}" que está en ${property.operation_type} por ${property.currency} ${property.price.toLocaleString()}${property.operation_type === 'alquiler' ? '/mes' : ''}. 

${characteristicsText}${locationText ? `

${locationText}` : ''}

¿Podrías darme más información?

¡Gracias!`;

    const phoneNumber = '5493815063361'; // Formato internacional sin espacios ni signos
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  // Lightbox component
  const LightboxComponent = () => (
    <motion.div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4"
      onClick={closeLightbox}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ 
          maxWidth: 'calc(100vw - 2rem)', 
          maxHeight: 'calc(100vh - 2rem)',
          minHeight: '0'
        }}
      >
        <img 
          src={property?.images[currentImageIndex]} 
          alt={`${property?.title} - Imagen ${currentImageIndex + 1}`}
          className="max-w-full max-h-full object-contain block"
          style={{
            maxWidth: 'calc(100vw - 8rem)',
            maxHeight: 'calc(100vh - 8rem)',
            width: 'auto',
            height: 'auto'
          }}
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        
        {/* Botón cerrar */}
        <motion.button
          onClick={closeLightbox}
          className="absolute top-2 right-2 p-2 bg-white/90 text-black rounded-full hover:bg-white transition-colors shadow-lg z-10"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-6 h-6" />
        </motion.button>
        
        {/* Navegación */}
        {property && property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 text-black rounded-full hover:bg-white transition-colors shadow-lg z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 text-black rounded-full hover:bg-white transition-colors shadow-lg z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
        
        {/* Contador */}
        <motion.div 
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full shadow-lg z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {currentImageIndex + 1} / {property?.images.length}
        </motion.div>
      </motion.div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-8 h-8 mx-auto mb-4 text-primary-400" />
            </motion.div>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Cargando propiedad...
            </motion.p>
          </motion.div>
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
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
                        <motion.h1 
                className="text-2xl font-bold text-gray-900 mb-4 font-heading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Propiedad no encontrada
              </motion.h1>
            <motion.p 
              className="text-gray-600 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              La propiedad que buscas no existe o ha sido eliminada.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                onClick={() => router.back()}
                className="bg-primary-400 hover:bg-primary-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver atrás
              </Button>
            </motion.div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna izquierda - Contenido principal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Título animado */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1 
                className="text-2xl font-bold text-gray-900 mb-2 font-heading"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {property.title}
              </motion.h1>
              <motion.div 
                className="flex items-center text-gray-600 mb-3"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-base font-body">{property.neighborhood || property.address || 'Ubicación no especificada'}</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Badge 
                  variant={property.operation_type === 'venta' ? 'default' : 'secondary'}
                  className={`text-xs px-2 py-1 ${
                    property.operation_type === 'venta' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  En {property.operation_type}
                </Badge>
                <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-100 text-gray-900 border-gray-300">
                  {formatPropertyType(property.property_type)}
                </Badge>
              </motion.div>
            </motion.div>

            {/* Galería de imágenes animada */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Imagen principal */}
              <motion.div 
                className="relative h-72 bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
                onClick={openLightbox}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
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
                  <motion.div 
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3"
                    whileHover={{ scale: 1.1, rotate: 15 }}
                  >
                    <Maximize2 className="w-6 h-6 text-gray-700" />
                  </motion.div>
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
                    <motion.div 
                      className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {currentImageIndex + 1} / {property.images.length}
                    </motion.div>
                  </>
                )}
              </motion.div>

              {/* Thumbnails */}
              {property.images.length > 1 && (
                <motion.div 
                  className="grid grid-cols-6 gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, staggerChildren: 0.1 }}
                >
                  {property.images.slice(0, 6).map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                        index === currentImageIndex 
                          ? 'border-primary-400 ring-2 ring-primary-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
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
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium text-sm">
                          +{property.images.length - 6}
                        </div>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Información básica animada */}
            <motion.div 
              className="bg-white border rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.h2 
                className="text-lg font-semibold text-gray-900 mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Características principales
              </motion.h2>
              
              {property.property_type === 'terreno' ? (
                /* Características específicas para terrenos */
                                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, staggerChildren: 0.1 }}
                  >
                    {/* Área del terreno */}
                    <motion.div 
                      className="text-center p-4 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Square className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{property.terreno || 'N/A'}</div>
                      <div className="text-xs text-gray-600">m² de Terreno</div>
                    </motion.div>

                  {/* Características especiales del terreno */}
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, staggerChildren: 0.1 }}
                  >
                    <motion.div 
                      className={`text-center p-4 rounded-lg border ${
                        property.barrio_cerrado 
                          ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100' 
                          : 'bg-gray-50 border-gray-100'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Shield className={`w-6 h-6 mx-auto mb-2 ${
                        property.barrio_cerrado ? 'text-orange-500' : 'text-gray-400'
                      }`} />
                      <div className={`text-xs font-medium ${
                        property.barrio_cerrado ? 'text-orange-700' : 'text-gray-500'
                      }`}>
                        Barrio Cerrado
                      </div>
                      <div className={`text-xs mt-1 ${
                        property.barrio_cerrado ? 'text-orange-600' : 'text-gray-400'
                      }`}>
                        {property.barrio_cerrado ? 'Sí' : 'No'}
                      </div>
                    </motion.div>

                    <motion.div 
                      className={`text-center p-4 rounded-lg border ${
                        property.es_country 
                          ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100' 
                          : 'bg-gray-50 border-gray-100'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <TreePine className={`w-6 h-6 mx-auto mb-2 ${
                        property.es_country ? 'text-orange-500' : 'text-gray-400'
                      }`} />
                      <div className={`text-xs font-medium ${
                        property.es_country ? 'text-orange-700' : 'text-gray-500'
                      }`}>
                        Country Club
                      </div>
                      <div className={`text-xs mt-1 ${
                        property.es_country ? 'text-orange-600' : 'text-gray-400'
                      }`}>
                        {property.es_country ? 'Sí' : 'No'}
                      </div>
                    </motion.div>

                    <motion.div 
                      className={`text-center p-4 rounded-lg border ${
                        property.paga_expensas 
                          ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100' 
                          : 'bg-gray-50 border-gray-100'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <DollarSign className={`w-6 h-6 mx-auto mb-2 ${
                        property.paga_expensas ? 'text-orange-500' : 'text-gray-400'
                      }`} />
                      <div className={`text-xs font-medium ${
                        property.paga_expensas ? 'text-orange-700' : 'text-gray-500'
                      }`}>
                        Paga Expensas
                      </div>
                      <div className={`text-xs mt-1 ${
                        property.paga_expensas ? 'text-orange-600' : 'text-gray-400'
                      }`}>
                        {property.paga_expensas ? 'Sí' : 'No'}
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ) : property.property_type === 'local' ? (
                /* Características específicas para locales */
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, staggerChildren: 0.1 }}
                >
                  {/* Área del local */}
                  <motion.div 
                    className="text-center p-4 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Square className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{getPropertyArea(property.property_type, property.construccion, property.terreno)}</div>
                    <div className="text-xs text-gray-600">m² de Construcción</div>
                  </motion.div>

                  {/* Características del local */}
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-1 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, staggerChildren: 0.1 }}
                  >
                    <motion.div 
                      className={`text-center p-4 rounded-lg border ${
                        property.paga_expensas 
                          ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100' 
                          : 'bg-gray-50 border-gray-100'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <DollarSign className={`w-6 h-6 mx-auto mb-2 ${
                        property.paga_expensas ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                      <div className={`text-xs font-medium ${
                        property.paga_expensas ? 'text-blue-700' : 'text-gray-500'
                      }`}>
                        Paga Expensas
                      </div>
                      <div className={`text-xs mt-1 ${
                        property.paga_expensas ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                        {property.paga_expensas ? 'Sí' : 'No'}
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ) : property.property_type === 'oficina' ? (
                /* Características específicas para oficinas */
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, staggerChildren: 0.1 }}
                >
                  {/* Área de la oficina */}
                  <motion.div 
                    className="text-center p-4 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Square className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{getPropertyArea(property.property_type, property.construccion, property.terreno)}</div>
                    <div className="text-xs text-gray-600">m² de Construcción</div>
                  </motion.div>

                  {/* Características de la oficina */}
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, staggerChildren: 0.1 }}
                  >
                    <motion.div 
                      className="text-center p-3 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Bath className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-900">{property.bathrooms}</div>
                      <div className="text-xs text-gray-600">Baños</div>
                    </motion.div>

                    <motion.div 
                      className={`text-center p-4 rounded-lg border ${
                        property.paga_expensas 
                          ? 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100' 
                          : 'bg-gray-50 border-gray-100'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <DollarSign className={`w-6 h-6 mx-auto mb-2 ${
                        property.paga_expensas ? 'text-purple-500' : 'text-gray-400'
                      }`} />
                      <div className={`text-xs font-medium ${
                        property.paga_expensas ? 'text-purple-700' : 'text-gray-500'
                      }`}>
                        Paga Expensas
                      </div>
                      <div className={`text-xs mt-1 ${
                        property.paga_expensas ? 'text-purple-600' : 'text-gray-400'
                      }`}>
                        {property.paga_expensas ? 'Sí' : 'No'}
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ) : property.property_type === 'casa' ? (
                /* Características específicas para casas */
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, staggerChildren: 0.1 }}
                >
                  {/* Características básicas de la casa */}
                  <motion.div 
                    className="grid grid-cols-2 md:grid-cols-4 gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, staggerChildren: 0.1 }}
                  >
                    <motion.div 
                      className="text-center p-3 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Bed className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-900">{property.bedrooms}</div>
                      <div className="text-xs text-gray-600">Dormitorios</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-3 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Bath className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-900">{property.bathrooms}</div>
                      <div className="text-xs text-gray-600">Baños</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-3 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Square className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-900 font-heading">{getPropertyArea(property.property_type, property.construccion, property.terreno)}</div>
                      <div className="text-xs text-gray-600 font-body">m² Construcción</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-3 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Building className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-900 font-heading">{property.terreno || 'N/A'}</div>
                      <div className="text-xs text-gray-600 font-body">m² Terreno</div>
                    </motion.div>
                  </motion.div>

                  {/* Características especiales de la casa */}
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, staggerChildren: 0.1 }}
                  >
                    <motion.div 
                      className={`text-center p-3 rounded-lg border ${
                        property.paga_expensas 
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100' 
                          : 'bg-gray-50 border-gray-100'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <DollarSign className={`w-6 h-6 mx-auto mb-2 ${
                        property.paga_expensas ? 'text-green-500' : 'text-gray-400'
                      }`} />
                      <div className={`text-xs font-medium ${
                        property.paga_expensas ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        Paga Expensas
                      </div>
                      <div className={`text-xs mt-1 ${
                        property.paga_expensas ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {property.paga_expensas ? 'Sí' : 'No'}
                      </div>
                    </motion.div>

                    <motion.div 
                      className={`text-center p-3 rounded-lg border ${
                        property.barrio_cerrado 
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100' 
                          : 'bg-gray-50 border-gray-100'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Shield className={`w-6 h-6 mx-auto mb-2 ${
                        property.barrio_cerrado ? 'text-green-500' : 'text-gray-400'
                      }`} />
                      <div className={`text-xs font-medium ${
                        property.barrio_cerrado ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        Barrio Privado
                      </div>
                      <div className={`text-xs mt-1 ${
                        property.barrio_cerrado ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {property.barrio_cerrado ? 'Sí' : 'No'}
                      </div>
                    </motion.div>

                    <motion.div 
                      className={`text-center p-3 rounded-lg border ${
                        property.es_country 
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100' 
                          : 'bg-gray-50 border-gray-100'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <TreePine className={`w-6 h-6 mx-auto mb-2 ${
                        property.es_country ? 'text-green-500' : 'text-gray-400'
                      }`} />
                      <div className={`text-xs font-medium ${
                        property.es_country ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        Country Club
                      </div>
                      <div className={`text-xs mt-1 ${
                        property.es_country ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {property.es_country ? 'Sí' : 'No'}
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ) : property.property_type === 'apartamento' ? (
                /* Características específicas para departamentos */
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, staggerChildren: 0.1 }}
                >
                  {/* Características básicas del departamento */}
                  <motion.div 
                    className="grid grid-cols-2 md:grid-cols-4 gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, staggerChildren: 0.1 }}
                  >
                    <motion.div 
                      className="text-center p-3 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Bed className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-900">{property.bedrooms}</div>
                      <div className="text-xs text-gray-600">Dormitorios</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-3 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Bath className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-900">{property.bathrooms}</div>
                      <div className="text-xs text-gray-600">Baños</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-3 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Square className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-900">{getPropertyArea(property.property_type, property.construccion, property.terreno)}</div>
                      <div className="text-xs text-gray-600">m² Construcción</div>
                    </motion.div>
                    <motion.div 
                      className={`text-center p-3 rounded-lg border ${
                        property.paga_expensas 
                          ? 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100' 
                          : 'bg-gray-50 border-gray-100'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <DollarSign className={`w-6 h-6 mx-auto mb-2 ${
                        property.paga_expensas ? 'text-indigo-500' : 'text-gray-400'
                      }`} />
                      <div className={`text-xs font-medium ${
                        property.paga_expensas ? 'text-indigo-700' : 'text-gray-500'
                      }`}>
                        Paga Expensas
                      </div>
                      <div className={`text-xs mt-1 ${
                        property.paga_expensas ? 'text-indigo-600' : 'text-gray-400'
                      }`}>
                        {property.paga_expensas ? 'Sí' : 'No'}
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ) : property.property_type === 'estacionamiento' ? (
                /* Características específicas para estacionamientos */
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, staggerChildren: 0.1 }}
                >
                  {/* Área del estacionamiento */}
                  <motion.div 
                    className="text-center p-4 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Square className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{property.terreno || 'N/A'}</div>
                    <div className="text-xs text-gray-600">m² Terreno</div>
                  </motion.div>

                  {/* Características específicas del estacionamiento */}
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, staggerChildren: 0.1 }}
                  >
                    <motion.div 
                      className={`text-center p-4 rounded-lg border ${
                        property.cubierto 
                          ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100' 
                          : 'bg-gray-50 border-gray-100'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Shield className={`w-8 h-8 mx-auto mb-2 ${
                        property.cubierto ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                      <div className={`text-lg font-bold ${
                        property.cubierto ? 'text-blue-700' : 'text-gray-500'
                      }`}>
                        {property.cubierto ? 'Cubierto' : 'Descubierto'}
                      </div>
                      <div className={`text-xs mt-1 ${
                        property.cubierto ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                        {property.cubierto ? 'Techado' : 'Al aire libre'}
                      </div>
                    </motion.div>

                    <motion.div 
                      className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Car className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <div className="text-lg font-bold text-orange-700">
                        {property.capacidad || 1} auto{(property.capacidad || 1) > 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-orange-600 mt-1">
                        Capacidad
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ) : (
                /* Características tradicionales para otros tipos de propiedades */
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, staggerChildren: 0.1 }}
                >
                  <motion.div 
                    className="text-center p-4 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Bed className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Dormitorios</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Bath className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Baños</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Square className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{getPropertyArea(property.property_type, property.construccion, property.terreno)}</div>
                    <div className="text-sm text-gray-600">m² Construcción</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Building className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{property.terreno || 'N/A'}</div>
                    <div className="text-sm text-gray-600">m² Terreno</div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>

            {/* Descripción animada */}
            <motion.div 
              className="bg-white border rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.h2 
                className="text-xl font-semibold text-gray-900 mb-4 font-heading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Descripción de la Propiedad
              </motion.h2>
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {(property.description || 'Hermosa casa en alquiler temporario (Estancia Mínima 3 noches) para 6 personas compuesta por:\nGalería cubierta, Living comedor\nCocina con mesada y bajo mesada\nBaño completo, Asador\nDos dormitorios. Uno con cama matrimonial y el otro con cuatro camas individuales.')
                  .split('\n')
                  .filter(line => line.trim() !== '')
                  .map((line, index) => (
                    <motion.div
                      key={index}
                      className="text-gray-600 leading-relaxed font-body"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      • {line.trim()}
                    </motion.div>
                  ))
                }
              </motion.div>
            </motion.div>

            {/* Características y amenidades animadas */}
            <motion.div 
              className="bg-white border rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.h2 
                className="text-xl font-semibold text-gray-900 mb-4 font-heading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Características
              </motion.h2>
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, staggerChildren: 0.1 }}
              >
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
                      <motion.div 
                        key={index} 
                        className="flex items-center p-3 bg-primary-50 border border-primary-200 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        whileHover={{ scale: 1.05, x: 5 }}
                      >
                        <IconComponent className="w-5 h-5 text-primary-600 mr-3" />
                        <span className="text-sm font-medium text-primary-700 font-body">{feature}</span>
                      </motion.div>
                    );
                  })
                ) : (
                  <>
                    <motion.div 
                      className="flex items-center p-3 bg-primary-50 border border-primary-200 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                      whileHover={{ scale: 1.05, x: 5 }}
                    >
                      <Car className="w-5 h-5 text-primary-600 mr-3" />
                      <span className="text-sm font-medium text-primary-700 font-body">Garaje</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center p-3 bg-primary-50 border border-primary-200 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      whileHover={{ scale: 1.05, x: 5 }}
                    >
                      <TreePine className="w-5 h-5 text-primary-600 mr-3" />
                      <span className="text-sm font-medium text-primary-700 font-body">Jardín</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center p-3 bg-primary-50 border border-primary-200 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      whileHover={{ scale: 1.05, x: 5 }}
                    >
                      <Wifi className="w-5 h-5 text-primary-600 mr-3" />
                      <span className="text-sm font-medium text-primary-700 font-body">WiFi</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center p-3 bg-primary-50 border border-primary-200 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 }}
                      whileHover={{ scale: 1.05, x: 5 }}
                    >
                      <Shield className="w-5 h-5 text-primary-600 mr-3" />
                      <span className="text-sm font-medium text-primary-700 font-body">Seguridad</span>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* Columna derecha - Mapa y contacto animada */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            
            {/* Ubicación y mapa */}
            <motion.div 
              className="bg-white border rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div 
                className="p-3 border-b"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold text-gray-900 font-heading">Ubicación</h3>
                  {property.latitude && property.longitude && (
                    <motion.div 
                      className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                      Coordenadas precisas
                    </motion.div>
                  )}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm font-body">{property.address || property.neighborhood || 'Ubicación no especificada'}</span>
                </div>
                {property.latitude && property.longitude && (
                  <motion.div 
                    className="mt-2 text-xs text-gray-500 font-mono"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
                  </motion.div>
                )}
              </motion.div>
              
              {/* Mapa interactivo */}
              <motion.div 
                className="h-48 bg-gray-100 relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="absolute inset-0">
                  <iframe
                    src={
                      // Usar coordenadas precisas si están disponibles, sino búsqueda por texto
                      property.latitude && property.longitude
                        ? `https://www.google.com/maps?q=${property.latitude},${property.longitude}&output=embed&z=16`
                        : `https://www.google.com/maps?q=${encodeURIComponent(
                            `${property.address || ''} ${property.neighborhood || ''} ${property.city || ''} ${property.province || ''}`
                          )}&output=embed`
                    }
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
                <motion.div 
                  className="absolute bottom-2 right-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <a
                    href={
                      // Usar coordenadas precisas si están disponibles, sino búsqueda por texto
                      property.latitude && property.longitude
                        ? `https://www.google.com/maps?q=${property.latitude},${property.longitude}&z=16`
                        : `https://www.google.com/maps/search/${encodeURIComponent(
                            `${property.address || ''} ${property.neighborhood || ''} ${property.city || ''} ${property.province || ''}`
                          )}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-white/90 hover:bg-white text-gray-700 text-xs px-2 py-1 rounded shadow-md transition-colors"
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    {property.latitude && property.longitude ? 'Ver ubicación exacta' : 'Ver en Google Maps'}
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Información del agente */}
            <motion.div 
              className="bg-white border rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div 
                className="flex items-center mb-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 font-heading">María Julieta Navarro</h3>
                  <p className="text-xs text-gray-600 font-body">Agente inmobiliario</p>                
                </div>
              </motion.div>
              
              <motion.div 
                className="space-y-2 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, staggerChildren: 0.1 }}
              >
                <motion.div 
                  className="flex items-center text-xs text-gray-600 font-body"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Phone className="w-3 h-3 mr-2" />
                  <span>+54 381 506-3361 (Ventas)</span>
                  <span>+54 9 3814 67-0607 (Ventas)</span>
                </motion.div>
                <motion.div 
                  className="flex items-center text-xs text-gray-600 font-body"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Mail className="w-3 h-3 mr-2" />
                  <span>Admgrouptuc@gmail.com</span>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >                 
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    variant="outline" 
                    className="w-full border-primary-400 text-primary-400 hover:bg-primary-50"
                    onClick={handleWhatsAppClick}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Enviar WhatsApp
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Formulario de contacto */}
            
            {/* Precio de la propiedad */}
            <motion.div 
              className="bg-white border rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <motion.div 
                  className="text-xl font-bold text-gray-800 mb-1 font-heading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  {property.currency} {property.price.toLocaleString()}{property.operation_type === 'alquiler' ? '/mes' : ''}
                </motion.div>
                <motion.div 
                  className="text-xs text-gray-600 font-body"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  {property.operation_type === 'venta' ? 'Precio de venta' : 'Precio de alquiler'}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
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