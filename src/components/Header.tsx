'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Mail } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Ventas', href: '/ventas' },
    { name: 'Alquileres', href: '/alquileres' },
    { name: 'Tasación', href: '/tasacion' },
    { name: 'Contacto', href: '/contacto' },
  ];

  const handleWhatsAppClick = () => {
    const phoneNumber = '5493816080780';
    const message = '¡Hola! Me interesa obtener más información sobre sus propiedades.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                <Image
                  src="/logo.svg"
                  alt="GROUP Inmobiliaria Logo"
                  width={180}
                  height={90}
                  className="h-20 w-auto"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-[#ff8425] transition-colors duration-200 font-medium text-lg"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Contact Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              onClick={handleWhatsAppClick}
              className="bg-[#ff8425] hover:bg-[#e6741f] text-white px-6 py-2.5 font-medium transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              Contactar por WhatsApp
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-[#ff8425] transition-colors duration-200 font-medium text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-3 pt-4">
                <Button 
                  onClick={handleWhatsAppClick}
                  className="bg-[#ff8425] hover:bg-[#e6741f] text-white w-full py-2.5 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contactar por WhatsApp
                </Button>
                <Link href="/contacto">
                  <Button className="bg-[#ff8425] hover:bg-[#e6741f] text-white w-full py-2.5 transition-colors">
                    <Mail className="w-4 h-4 mr-2" />
                    Consultar
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;