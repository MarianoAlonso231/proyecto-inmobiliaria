'use client';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturedProperties from '@/components/FeaturedProperties';
import ServicesSection from '@/components/ServicesSection';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

// Sección de contenido SEO local
function LocalSEOContent() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contenido principal SEO */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Inmobiliaria Líder en Tucumán
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Somos la <strong>inmobiliaria más confiable en Tucumán</strong>, especializada en la compra, venta y alquiler de propiedades. 
            Con más de 10 años de experiencia en el mercado inmobiliario tucumano, te ayudamos a encontrar tu hogar ideal.
          </p>
        </div>



        {/* Servicios destacados */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            ¿Por qué elegir nuestra inmobiliaria en Tucumán?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">🏠</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Inmobiliaria Confiable</h4>
              <p className="text-sm text-gray-600">Más de 1000 operaciones exitosas en Tucumán</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <span className="text-green-600 font-bold text-xl">💰</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Financiación Disponible</h4>
              <p className="text-sm text-gray-600">Te ayudamos con créditos hipotecarios y planes de pago</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <span className="text-purple-600 font-bold text-xl">⚖️</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Asesoramiento Legal</h4>
              <p className="text-sm text-gray-600">Equipo jurídico especializado en bienes raíces</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <span className="text-orange-600 font-bold text-xl">📍</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cobertura Local</h4>
              <p className="text-sm text-gray-600">Atendemos toda la provincia de Tucumán</p>
            </div>
          </div>
        </div>

        {/* Llamada a la acción */}
        <div className="text-center mt-12">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">
            ¿Buscás comprar, vender o alquilar en Tucumán?
          </h4>
          <p className="text-gray-600 mb-6">
            Contactanos hoy mismo. Somos la <strong>inmobiliaria recomendada en Tucumán </strong> 
            para todas tus necesidades inmobiliarias.
          </p>
          <div className="space-x-4">
            <a 
              href="/contacto" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Contactar Ahora
            </a>
            <a 
              href="/tasacion" 
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Tasación
            </a>
          </div>
        </div>
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
      <ServicesSection />
      <LocalSEOContent />
      <Footer />
    </div>
  );
}