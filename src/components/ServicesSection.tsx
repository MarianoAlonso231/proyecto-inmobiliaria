'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Key, Calculator, Phone } from 'lucide-react';


const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 80,
      scale: 0.9,
      rotateX: 15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.25, 0.25, 0.75],
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const headerVariants = {
    hidden: { 
      opacity: 0, 
      y: -40,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const services = [
    {
      id: 'ventas',
      title: 'Ventas',
              description: 'Encuentra la propiedad perfecta para comprar. Tenemos una amplia selección de casas, departamentos y locales comerciales.',
      icon: Home,
      color: 'bg-[#ff8425]',
      href: '/ventas'
    },
    {
      id: 'alquileres',
      title: 'Alquileres',
      description: 'Descubre opciones de alquiler que se adapten a tu presupuesto y necesidades. Desde estudios hasta casas familiares.',
      icon: Key,
      color: 'bg-[#ff8425]',
      href: '/alquileres'
    },
    {
      id: 'tasacion',
      title: 'Tasación',
      description: 'Obtén una valuación profesional de tu propiedad. Nuestros expertos te ayudan a conocer el valor real de tu inmueble.',
      icon: Calculator,
      color: 'bg-[#ff8425]',
      href: '/tasacion'
    },
    {
      id: 'contacto',
      title: 'Contacto',
      description: 'Ponte en contacto con nuestro equipo de profesionales. Estamos aquí para ayudarte en cada paso del proceso.',
      icon: Phone,
      color: 'bg-[#ff8425]',
      href: '/contacto'
    }
  ];

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={isInView ? { 
              opacity: 1, 
              y: 0, 
              scale: 1 
            } : { 
              opacity: 0, 
              y: 20, 
              scale: 0.95 
            }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Nuestros servicios
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { 
              opacity: 1, 
              y: 0 
            } : { 
              opacity: 0, 
              y: 20 
            }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Te acompañamos en cada etapa de tu experiencia inmobiliaria
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div 
                key={service.id}
                variants={itemVariants}
                whileHover={{ 
                  y: -12,
                  rotateY: 5,
                  transition: { duration: 0.3, ease: "easeOut" } 
                }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-500 h-full bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
                  <CardContent className="p-6 text-center h-full flex flex-col relative overflow-hidden">
                    {/* Efecto de brillo en hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                      initial={{ x: "-100%" }}
                      whileHover={{ 
                        x: "100%",
                        transition: { duration: 0.6, ease: "easeInOut" }
                      }}
                    />
                    
                    <motion.div 
                      className={`${service.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10`}
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.15,
                        boxShadow: "0 10px 30px rgba(255, 132, 37, 0.4)"
                      }}
                      transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </motion.div>
                    </motion.div>
                    
                    <motion.h3 
                      className="text-xl font-semibold text-gray-800 mb-3"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {service.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-gray-600 mb-6 text-sm leading-relaxed flex-grow"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {service.description}
                    </motion.p>
                    
                    <Link href={service.href}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          className="bg-[#ff8425] hover:bg-[#e6741f] text-white transition-all duration-300 w-full hover:shadow-lg"
                        >
                          Más información
                        </Button>
                      </motion.div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
