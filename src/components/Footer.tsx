
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="bg-primary-400 text-white px-3 py-2 rounded-lg font-bold text-xl mb-4 inline-block">
              InmoBI
            </div>
            <p className="text-gray-300 mb-4">
              Tu socio de confianza en el mercado inmobiliario. Más de 10 años ayudando a familias a encontrar su hogar ideal.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-300 hover:text-primary-400 cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-300 hover:text-primary-400 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-300 hover:text-primary-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li><a href="#ventas" className="text-gray-300 hover:text-primary-400 transition-colors">Ventas</a></li>
              <li><a href="#alquileres" className="text-gray-300 hover:text-primary-400 transition-colors">Alquileres</a></li>
              <li><a href="#tasacion" className="text-gray-300 hover:text-primary-400 transition-colors">Tasación</a></li>
              <li><a href="#contacto" className="text-gray-300 hover:text-primary-400 transition-colors">Asesoramiento</a></li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tipos de propiedad</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-300">Casas</span></li>
              <li><span className="text-gray-300">Apartamentos</span></li>
              <li><span className="text-gray-300">Oficinas</span></li>
              <li><span className="text-gray-300">Locales comerciales</span></li>
              <li><span className="text-gray-300">Terrenos</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-primary-400" />
                <span className="text-gray-300">+54 381 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-primary-400" />
                <span className="text-gray-300">info@inmobi.com</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-3 text-primary-400 mt-1" />
                <span className="text-gray-300">
                  Av. Independencia 123<br />
                  San Miguel de Tucumán
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 InmoBI. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
