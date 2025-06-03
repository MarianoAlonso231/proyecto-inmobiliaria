'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Home, FileText, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TasacionPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    tipoPropiedad: '',
    dormitorios: '',
    banos: '',
    superficie: '',
    antiguedad: '',
    estado: '',
    descripcion: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Solicitud de tasación:', formData);
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
                ¡Solicitud enviada exitosamente!
              </h1>
              <p className="text-gray-600 mb-6">
                Hemos recibido tu solicitud de tasación. Nuestro equipo se pondrá en contacto contigo en las próximas 24 horas para coordinar la visita.
              </p>
              <Button 
                onClick={() => setIsSubmitted(false)}
                className="bg-primary-400 hover:bg-primary-500"
              >
                Enviar otra solicitud
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Tasación de Propiedades
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Obtén una valuación profesional de tu propiedad de forma gratuita. Nuestros expertos te ayudarán a conocer el valor real de tu inmueble.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Calculator className="w-12 h-12 text-primary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Valuación Profesional</h3>
              <p className="text-gray-600 text-sm">
                Análisis detallado del mercado y características únicas de tu propiedad
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Home className="w-12 h-12 text-primary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Visita sin compromiso</h3>
              <p className="text-gray-600 text-sm">
                Nuestros expertos visitarán tu propiedad para una evaluación presencial
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="w-12 h-12 text-primary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Informe Detallado</h3>
              <p className="text-gray-600 text-sm">
                Recibirás un reporte completo con el valor estimado y recomendaciones
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Solicitar Tasación Gratuita</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="direccion">Dirección de la propiedad *</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => handleInputChange('direccion', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tipoPropiedad">Tipo de propiedad *</Label>
                  <Select value={formData.tipoPropiedad} onValueChange={(value) => handleInputChange('tipoPropiedad', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="apartamento">Apartamento</SelectItem>
                      <SelectItem value="terreno">Terreno</SelectItem>
                      <SelectItem value="oficina">Oficina</SelectItem>
                      <SelectItem value="local">Local comercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dormitorios">Dormitorios</Label>
                  <Select value={formData.dormitorios} onValueChange={(value) => handleInputChange('dormitorios', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cantidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5+">5 o más</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="banos">Baños</Label>
                  <Select value={formData.banos} onValueChange={(value) => handleInputChange('banos', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cantidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4+">4 o más</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="superficie">Superficie (m²)</Label>
                  <Input
                    id="superficie"
                    type="number"
                    value={formData.superficie}
                    onChange={(e) => handleInputChange('superficie', e.target.value)}
                    placeholder="Ejemplo: 120"
                  />
                </div>

                <div>
                  <Label htmlFor="antiguedad">Antigüedad</Label>
                  <Select value={formData.antiguedad} onValueChange={(value) => handleInputChange('antiguedad', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nueva">A estrenar</SelectItem>
                      <SelectItem value="0-5">0 a 5 años</SelectItem>
                      <SelectItem value="5-10">5 a 10 años</SelectItem>
                      <SelectItem value="10-20">10 a 20 años</SelectItem>
                      <SelectItem value="20+">Más de 20 años</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="estado">Estado de la propiedad</Label>
                  <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excelente">Excelente</SelectItem>
                      <SelectItem value="muy-bueno">Muy bueno</SelectItem>
                      <SelectItem value="bueno">Bueno</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="necesita-refaccion">Necesita refacción</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción adicional</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  placeholder="Cuéntanos más detalles sobre tu propiedad..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full bg-primary-400 hover:bg-primary-500">
                Solicitar Tasación
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}