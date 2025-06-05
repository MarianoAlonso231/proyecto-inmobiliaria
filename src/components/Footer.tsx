import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info - Mejorado */}
          <div>
            <div className="mb-6">
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 inline-block">
                <Image
                  src="/logo.svg"
                  alt="GROUP Inmobiliaria Logo"
                  width={160}
                  height={80}
                  className="h-16 w-auto"
                />
              </div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Tu socio de confianza en el mercado inmobiliario. Más de 10 años ayudando a familias a encontrar su hogar ideal en Tucumán.
            </p>
            <div className="flex space-x-3">
              <a href="https://www.facebook.com/profile.php?id=100063511333401&mibextid=wwXIfr&rdid=XS58cjdPJU3DF053&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F12MUEDoV4A4%2F%3Fmibextid%3DwwXIfr" className="p-2 bg-white border border-gray-200 rounded-full hover:bg-[#ff8425] hover:border-[#ff8425] transition-colors group shadow-sm" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-5 h-5 text-gray-600 group-hover:text-white" />
              </a>
              <a href="https://www.instagram.com/groupadministraciones/" className="p-2 bg-white border border-gray-200 rounded-full hover:bg-[#ff8425] hover:border-[#ff8425] transition-colors group shadow-sm" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5 text-gray-600 group-hover:text-white" />
              </a>            
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Servicios</h3>
            <ul className="space-y-3">
              <li>
                <a href="/ventas" className="text-gray-600 hover:text-[#ff8425] transition-colors duration-200 flex items-center group">
                  <span className="w-2 h-2 bg-[#ff8425] rounded-full mr-3 group-hover:bg-[#e6741f]"></span>
                  Ventas
                </a>
              </li>
              <li>
                <a href="/alquileres" className="text-gray-600 hover:text-[#ff8425] transition-colors duration-200 flex items-center group">
                  <span className="w-2 h-2 bg-[#ff8425] rounded-full mr-3 group-hover:bg-[#e6741f]"></span>
                  Alquileres
                </a>
              </li>
              <li>
                <a href="/tasacion" className="text-gray-600 hover:text-[#ff8425] transition-colors duration-200 flex items-center group">
                  <span className="w-2 h-2 bg-[#ff8425] rounded-full mr-3 group-hover:bg-[#e6741f]"></span>
                  Tasación
                </a>
              </li>
              <li>
                <a href="/contacto" className="text-gray-600 hover:text-[#ff8425] transition-colors duration-200 flex items-center group">
                  <span className="w-2 h-2 bg-[#ff8425] rounded-full mr-3 group-hover:bg-[#e6741f]"></span>
                  Asesoramiento
                </a>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Tipos de propiedad</h3>
            <ul className="space-y-3">
              <li className="text-gray-600 flex items-center">
                <span className="w-2 h-2 bg-[#ff8425] rounded-full mr-3"></span>
                Casas
              </li>
              <li className="text-gray-600 flex items-center">
                <span className="w-2 h-2 bg-[#ff8425] rounded-full mr-3"></span>
                Apartamentos
              </li>
              <li className="text-gray-600 flex items-center">
                <span className="w-2 h-2 bg-[#ff8425] rounded-full mr-3"></span>
                Oficinas
              </li>
              <li className="text-gray-600 flex items-center">
                <span className="w-2 h-2 bg-[#ff8425] rounded-full mr-3"></span>
                Locales comerciales
              </li>
              <li className="text-gray-600 flex items-center">
                <span className="w-2 h-2 bg-[#ff8425] rounded-full mr-3"></span>
                Terrenos
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-center group">
                <div className="p-2 bg-[#ff8425] rounded-lg mr-3 group-hover:bg-[#e6741f] transition-colors shadow-sm">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">+54 9 3815 06-3361</p>
                  <p className="text-gray-600 text-sm">+54 9 3812 23-1989</p>
                </div>
              </div>
              <div className="flex items-center group">
                <div className="p-2 bg-[#ff8425] rounded-lg mr-3 group-hover:bg-[#e6741f] transition-colors shadow-sm">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Admgrouptuc@gmail.com</p>                 
                </div>
              </div>
              <div className="flex items-start group">
                <div className="p-2 bg-[#ff8425] rounded-lg mr-3 group-hover:bg-[#e6741f] transition-colors shadow-sm">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">
                    San Martin 1051 8° D<br />
                    San Miguel de Tucumán<br />
                    Tucumán, Argentina
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 GROUP Inmobiliaria. Todos los derechos reservados.
            </p>
                          <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-500 hover:text-[#ff8425] text-sm transition-colors">
                  Política de Privacidad
                </a>
                <a href="#" className="text-gray-500 hover:text-[#ff8425] text-sm transition-colors">
                  Términos de Servicio
                </a>
                <a href="#" className="text-gray-500 hover:text-[#ff8425] text-sm transition-colors">
                  Cookies
                </a>
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;