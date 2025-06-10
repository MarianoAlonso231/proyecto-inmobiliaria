'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useScrollAnimation, fadeInUp, fadeInLeft, fadeInRight, staggerContainer, staggerItem } from '@/hooks/useScrollAnimation';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });

  // Animation hooks
  const { ref: headerRef, controls: headerControls } = useScrollAnimation();
  const { ref: infoRef, controls: infoControls } = useScrollAnimation();
  const { ref: formRef, controls: formControls } = useScrollAnimation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obligatorios
    if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
      alert('Por favor, completa todos los campos obligatorios (*)');
      return;
    }
    
    // Determinar el número de WhatsApp según el asunto
    const phoneNumber = formData.asunto === 'administracion' 
      ? '5493812231989'  // +54 9 3812 23-1989 para Administración
      : '5493815063361'; // +54 9 3815 06-3361 para otros asuntos (Ventas)
    
    // Crear el mensaje para WhatsApp
    const asuntoText = {
      'consulta-general': 'Consulta general',
      'compra': 'Interés en compra',
      'venta': 'Quiero vender mi propiedad',
      'alquiler': 'Búsqueda de alquiler',
      'tasacion': 'Solicitud de tasación',
      'inversion': 'Oportunidades de inversión',
      'administracion': 'Administración'
    }[formData.asunto] || formData.asunto;
    
    const whatsappMessage = `¡Hola! Me pongo en contacto desde el sitio web.

📋 *Datos de contacto:*
• Nombre: ${formData.nombre}
• Email: ${formData.email}
${formData.telefono ? `• Teléfono: ${formData.telefono}` : ''}

📌 *Asunto:* ${asuntoText}

💬 *Mensaje:*
${formData.mensaje}

¡Espero su respuesta!`;

    // Abrir WhatsApp con el mensaje
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header animado */}
        <motion.div 
          ref={headerRef}
          initial="hidden"
          animate={headerControls}
          variants={fadeInUp}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Contactanos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Ponte en contacto con nuestro equipo de profesionales inmobiliarios.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información de contacto animada */}
          <motion.div
            ref={infoRef}
            initial="hidden"
            animate={infoControls}
            variants={fadeInLeft}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div 
                  variants={staggerItem}
                  initial="hidden"
                  animate="visible"
                  className="flex items-start space-x-4"
                >
                  <Phone className="w-6 h-6 text-primary-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Teléfono</h3>
                    <p className="text-gray-600">+54 9 3815 06-3361 (Ventas)</p>
                    <p className="text-gray-600">+54 9 3812 23-1989 (administración)</p>
                  </div>
                </motion.div>

                <motion.div 
                  variants={staggerItem}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <Mail className="w-6 h-6 text-primary-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">Admgrouptuc@gmail.com</p>               
                  </div>
                </motion.div>

                <motion.div 
                  variants={staggerItem}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="flex items-start space-x-4"
                >
                  <MapPin className="w-6 h-6 text-primary-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Dirección</h3>
                    <p className="text-gray-600">
                      San Martin 1051 8° D<br />
                      San Miguel de Tucumán<br />
                      Tucumán, Argentina
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  variants={staggerItem}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                  className="flex items-start space-x-4"
                >
                  <Clock className="w-6 h-6 text-primary-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Horarios de Atención</h3>
                    <p className="text-gray-600">
                      Lunes a Viernes: 9:30 - 13:00<br />
                      Martes y Jueves: 14:30 - 16:00<br />
                      Domingos y sábados: Cerrado
                    </p>
                  </div>
                </motion.div>

                {/* Mapa funcional animado */}
                <motion.div 
                  variants={staggerItem}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                  className="mt-6"
                >
                  <h3 className="font-semibold text-gray-800 mb-3">Nuestra Ubicación</h3>
                  <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <iframe
                      src="https://www.google.com/maps?q=San+Martin+1051+8°+D,+San+Miguel+de+Tucumán,+Tucumán,+Argentina&output=embed"
                      width="100%"
                      height="250"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Ubicación de InmoBI - San Martín 1051 8° D, San Miguel de Tucumán"
                      className="w-full h-64 rounded-lg"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <a
                      href="https://www.google.com/maps/search/San+Martin+1051+8°+D,+San+Miguel+de+Tucumán,+Tucumán,+Argentina"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-400 hover:text-primary-500 text-sm font-medium transition-colors"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Ver en Google Maps
                    </a>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Formulario de contacto animado */}
          <motion.div
            ref={formRef}
            initial="hidden"
            animate={formControls}
            variants={fadeInRight}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Envíanos un Mensaje</CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Tu mensaje se enviará directamente por WhatsApp al equipo correspondiente según el asunto seleccionado.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre completo *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="asunto">Asunto *</Label>
                    <Select value={formData.asunto} onValueChange={(value) => handleInputChange('asunto', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un asunto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consulta-general">Consulta general</SelectItem>
                        <SelectItem value="compra">Interés en compra</SelectItem>
                        <SelectItem value="venta">Quiero vender mi propiedad</SelectItem>
                        <SelectItem value="alquiler">Búsqueda de alquiler</SelectItem>
                        <SelectItem value="tasacion">Solicitud de tasación</SelectItem>
                        <SelectItem value="inversion">Oportunidades de inversión</SelectItem>
                        <SelectItem value="administracion">Administración</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.asunto === 'administracion' 
                        ? 'Se enviará al número de administración: +54 9 3812 23-1989'
                        : 'Se enviará al número de ventas: +54 9 3815 06-3361'
                      }
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="mensaje">Mensaje *</Label>
                    <Textarea
                      id="mensaje"
                      value={formData.mensaje}
                      onChange={(e) => handleInputChange('mensaje', e.target.value)}
                      placeholder="Cuéntanos en qué podemos ayudarte..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Enviar por WhatsApp
                  </Button>
                  
                  <p className="text-sm text-gray-500 text-center">
                    Al hacer clic, se abrirá WhatsApp con tu mensaje pre-cargado
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
      </div>

      <Footer />
    </div>
  );
}