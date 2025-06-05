'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determinar el número de WhatsApp según el asunto
    const phoneNumber = formData.asunto === 'administracion' 
      ? '5493814404335'  // +54 9 3814 40-4335 para Administración
      : '5493816080780'; // +54 9 3816 08-0780 para otros asuntos
    
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

*Datos de contacto:*
• Nombre: ${formData.nombre}
• Email: ${formData.email}
${formData.telefono ? `• Teléfono: ${formData.telefono}` : ''}

*Asunto:* ${asuntoText}

*Mensaje:*
${formData.mensaje}

¡Espero su respuesta!`;

    // Abrir WhatsApp con el mensaje
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    setIsSubmitted(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="p-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                ¡Mensaje enviado por WhatsApp!
              </h1>
              <p className="text-gray-600 mb-6">
                Tu mensaje se ha abierto en WhatsApp. Gracias por contactarnos, nos pondremos en contacto contigo lo antes posible.
              </p>
              <Button 
                onClick={() => setIsSubmitted(false)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Enviar otro mensaje por WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Contactanos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Ponte en contacto con nuestro equipo de profesionales inmobiliarios.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información de contacto */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-primary-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Teléfono</h3>
                    <p className="text-gray-600">+54 9 3815 06-3361 (Ventas)</p>
                    <p className="text-gray-600">+54 9 3812 23-1989 (administración)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-primary-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">Admgrouptuc@gmail.com</p>               
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-primary-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Dirección</h3>
                    <p className="text-gray-600">
                      San Martin 1051 8° D<br />
                      San Miguel de Tucumán<br />
                      Tucumán, Argentina
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-primary-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Horarios de Atención</h3>
                    <p className="text-gray-600">
                      Lunes a Viernes: 9:30 - 13:00<br />
                      Martes y Jueves: 14:30 - 16:00<br />
                      Domingos y sábados: Cerrado
                    </p>
                  </div>
                </div>

                {/* Mapa funcional */}
                <div className="mt-6">
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulario de contacto */}
          <div>
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
                    <Phone className="w-4 h-4 mr-2" />
                    Enviar por WhatsApp
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sección adicional */}
        
      </div>

      <Footer />
    </div>
  );
}