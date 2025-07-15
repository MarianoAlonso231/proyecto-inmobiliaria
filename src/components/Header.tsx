'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Mail } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Implementar hysteresis para evitar el parpadeo:
      // - Al bajar: se activa a los 100px
      // - Al subir: se desactiva a los 80px
      // Esto evita que cambie constantemente cerca del umbral
      if (!isScrolled && scrollY > 100) {
        setIsScrolled(true);
      } else if (isScrolled && scrollY < 80) {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]); // Agregamos isScrolled como dependencia

  const navItems = [
    { name: 'Ventas', href: '/ventas' },
    { name: 'Alquileres', href: '/alquileres' },
    { name: 'Mapa', href: '/mapa' },
    { name: 'Tasación', href: '/tasacion' },
    { name: 'Contacto', href: '/contacto' },
  ];

  const handleWhatsAppClick = () => {
    const phoneNumber = '5493812231989';
    const message = '¡Hola! Me interesa obtener más información sobre sus propiedades.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.header 
      className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xl' 
          : 'bg-white shadow-md'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-500 ${
          isScrolled ? 'py-1 md:py-2' : 'py-2 md:py-3'
        }`}>
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <Link href="/" className="flex items-center">
              <motion.div 
                className={`bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-500 ${
                  isScrolled ? 'p-2' : 'p-3'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className={`text-gradient font-bold tracking-tight transition-all duration-500 ${
                  isScrolled 
                    ? 'text-lg md:text-xl' 
                    : 'text-2xl md:text-3xl'
                }`}>
                  Group Inmobiliaria
                </h1>
              </motion.div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav 
            className="hidden md:flex space-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.4 + (index * 0.1),
                  ease: "easeOut" 
                }}
              >
                <Link
                  href={item.href}
                  className={`text-gray-700 hover:text-[#ff8425] transition-all duration-300 font-medium relative group ${
                    isScrolled ? 'text-base' : 'text-lg'
                  }`}
                >
                  {item.name}
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-[#ff8425] origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Contact Buttons Desktop */}
          <motion.div 
            className="hidden md:flex items-center space-x-3"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleWhatsAppClick}
                className={`bg-[#ff8425] hover:bg-[#e6741f] text-white font-medium transition-all duration-300 ${
                  isScrolled 
                    ? 'px-4 py-2 text-sm' 
                    : 'px-6 py-2.5 text-base animate-pulse-glow'
                }`}
              >
                <Phone className={`mr-2 transition-all duration-300 ${
                  isScrolled ? 'w-3 h-3' : 'w-4 h-4'
                }`} />
                {isScrolled ? 'WhatsApp' : 'Contactar por WhatsApp'}
              </Button>
            </motion.div>
          </motion.div>

          {/* Mobile menu button */}
          <motion.button
            className={`md:hidden rounded-lg hover:bg-gray-100 transition-all duration-300 ${
              isScrolled ? 'p-1.5' : 'p-2'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className={`transition-all duration-300 ${
                    isScrolled ? 'w-5 h-5' : 'w-6 h-6'
                  }`} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className={`transition-all duration-300 ${
                    isScrolled ? 'w-5 h-5' : 'w-6 h-6'
                  }`} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden py-3 border-t overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <nav className="flex flex-col space-y-3">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.1,
                      ease: "easeOut" 
                    }}
                  >
                    <Link
                      href={item.href}
                      className="text-gray-700 hover:text-[#ff8425] transition-colors duration-200 font-medium text-base block py-2 px-4 rounded-lg hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div 
                  className="flex flex-col space-y-2 pt-3"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={() => {
                        handleWhatsAppClick();
                        setIsMenuOpen(false);
                      }}
                      className="bg-[#ff8425] hover:bg-[#e6741f] text-white w-full py-2 text-sm transition-colors"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Link href="/contacto" onClick={() => setIsMenuOpen(false)}>
                      <Button className="bg-[#ff8425] hover:bg-[#e6741f] text-white w-full py-2 text-sm transition-colors">
                        <Mail className="w-4 h-4 mr-2" />
                        Consultar
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;