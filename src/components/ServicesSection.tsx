
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Key, Calculator, Phone } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      id: 'ventas',
      title: 'Ventas',
      description: 'Encuentra la propiedad perfecta para comprar. Tenemos una amplia selección de casas, apartamentos y locales comerciales.',
      icon: Home,
      color: 'bg-green-500',
      href: '/ventas'
    },
    {
      id: 'alquileres',
      title: 'Alquileres',
      description: 'Descubre opciones de alquiler que se adapten a tu presupuesto y necesidades. Desde estudios hasta casas familiares.',
      icon: Key,
      color: 'bg-blue-500',
      href: '/alquileres'
    },
    {
      id: 'tasacion',
      title: 'Tasación',
      description: 'Obtén una valuación profesional de tu propiedad. Nuestros expertos te ayudan a conocer el valor real de tu inmueble.',
      icon: Calculator,
      color: 'bg-purple-500',
      href: '/tasacion'
    },
    {
      id: 'contacto',
      title: 'Contacto',
      description: 'Ponte en contacto con nuestro equipo de profesionales. Estamos aquí para ayudarte en cada paso del proceso.',
      icon: Phone,
      color: 'bg-primary-400',
      href: '/contacto'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Nuestros servicios
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Te acompañamos en cada etapa de tu experiencia inmobiliaria
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className={`${service.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <Link href={service.href}>
                    <Button 
                      variant="outline" 
                      className="border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white transition-colors w-full"
                    >
                      Más información
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
