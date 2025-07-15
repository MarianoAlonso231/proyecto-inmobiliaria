'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Home as HomeIcon, DollarSign, Scale, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturedProperties from '@/components/FeaturedProperties';
import MapSection from '@/components/MapSection';
import ServicesSection from '@/components/ServicesSection';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

// Sección de contenido SEO local con animaciones
function LocalSEOContent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Variantes de animación (mismas que ServicesSection)
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
      id: 'experiencia',
      title: 'Inmobiliaria en Tucumán',
      description: 'Más de 1000 operaciones exitosas en Tucumán',
      icon: HomeIcon
    },
    {
      id: 'financiacion',
      title: 'Financiación Disponible',
      description: 'Te ayudamos con créditos hipotecarios y planes de pago',
      icon: DollarSign
    },
    {
      id: 'legal',
      title: 'Asesoramiento Legal',
      description: 'Equipo jurídico especializado en bienes raíces',
      icon: Scale
    },
    {
      id: 'cobertura',
      title: 'Cobertura Local',
      description: 'Atendemos toda la provincia de Tucumán',
      icon: MapPin
    }
  ];

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contenido principal SEO */}
        <motion.div 
          className="text-center mb-12"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
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
            Inmobiliaria Líder en Tucumán
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-3xl mx-auto"
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
            Somos una <strong>inmobiliaria líder en Tucumán</strong>, especializada en la compra, venta y alquiler de propiedades. 
            Con más de 10 años de experiencia en el mercado inmobiliario tucumano, te ayudamos a encontrar tu hogar ideal.
          </motion.p>
        </motion.div>

        {/* Servicios destacados con animaciones */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl mb-12">
            <CardContent className="p-8 relative overflow-hidden">
              {/* Efecto de brillo en hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                initial={{ x: "-100%" }}
                whileHover={{ 
                  x: "100%",
                  transition: { duration: 0.6, ease: "easeInOut" }
                }}
              />
              
              <motion.h3 
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                ¿Por qué elegir nuestra inmobiliaria en Tucumán?
              </motion.h3>
              
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
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
                       className="text-center group/item relative z-10"
                     >
                       <motion.div 
                         className="bg-[#ff8425] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative"
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
                    
                    <motion.h4 
                      className="font-semibold text-gray-900 mb-3"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {service.title}
                    </motion.h4>
                    
                    <motion.p 
                      className="text-sm text-gray-600 leading-relaxed"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {service.description}
                                         </motion.p>
                     </motion.div>
                   );
                 })}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Llamada a la acción animada */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <motion.h4 
            className="text-xl md:text-2xl font-semibold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            ¿Buscás comprar, vender o alquilar en Tucumán?
          </motion.h4>
          
          <motion.p 
            className="text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            Contactanos hoy mismo. Somos tu <strong>inmobiliaria de confianza en Tucumán</strong> 
            para todas tus necesidades inmobiliarias.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <motion.a 
              href="/contacto" 
              className="bg-[#ff8425] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#e6741f] transition-all duration-300 hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contactar Ahora
            </motion.a>
            <motion.a 
              href="/tasacion" 
              className="bg-[#ff8425] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#e6741f] transition-all duration-300 hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Tasación
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead pageType="home" />
      <Header />
      <HeroSection />
      <FeaturedProperties />
      <MapSection />
      <ServicesSection />
      <LocalSEOContent />
      <Footer />
    </div>
  );
}