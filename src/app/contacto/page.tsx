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
    console.log('Mensaje de contacto:', formData);
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
                ¡Mensaje enviado exitosamente!
              </h1>
              <p className="text-gray-600 mb-6">
                Gracias por contactarnos. Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.
              </p>
              <Button 
                onClick={() => setIsSubmitted(false)}
                className="bg-primary-400 hover:bg-primary-500"
              >
                Enviar otro mensaje
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
                    <p className="text-gray-600">+54 381 123-4567</p>
                    <p className="text-gray-600">+54 381 987-6543</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-primary-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">info@inmobi.com</p>
                    <p className="text-gray-600">ventas@inmobi.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-primary-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Dirección</h3>
                    <p className="text-gray-600">
                      Av. Independencia 123<br />
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
                      Lunes a Viernes: 9:00 - 18:00<br />
                      Sábados: 9:00 - 13:00<br />
                      Domingos: Cerrado
                    </p>
                  </div>
                </div>

                {/* Mapa placeholder */}
                <div className="mt-6">
                  <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Mapa de ubicación</p>
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
                        <SelectItem value="otro">Otro</SelectItem>
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

                  <Button type="submit" className="w-full bg-primary-400 hover:bg-primary-500">
                    Enviar Mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sección adicional */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ¿Necesitas ayuda inmediata?
              </h2>
              <p className="text-gray-600 mb-6">
                Nuestro equipo está disponible para atenderte. Llámanos directamente o programa una cita.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-primary-400 hover:bg-primary-500">
                  <Phone className="w-4 h-4 mr-2" />
                  Llamar ahora
                </Button>
                <Button variant="outline" className="border-primary-400 text-primary-400 hover:bg-primary-50">
                  <Mail className="w-4 h-4 mr-2" />
                  Programar cita
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}