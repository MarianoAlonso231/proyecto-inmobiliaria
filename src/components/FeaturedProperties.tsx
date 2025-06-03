
import PropertyCard from './PropertyCard';

const FeaturedProperties = () => {
  // Datos de ejemplo - estos vendrían de Supabase
  const properties = [
    {
      id: '1',
      title: 'Casa moderna en el centro',
      price: 'US$ 250.000',
      location: 'Centro - San Miguel de Tucumán',
      bedrooms: 3,
      bathrooms: 2,
      area: '150m²',
      image: '/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png',
      type: 'venta' as const,
      propertyType: 'Casa'
    },
    {
      id: '2',
      title: 'Apartamento con vista panorámica',
      price: 'US$ 180.000',
      location: 'Norte - San Miguel de Tucumán',
      bedrooms: 2,
      bathrooms: 1,
      area: '80m²',
      image: '/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png',
      type: 'venta' as const,
      propertyType: 'Apartamento'
    },
    {
      id: '3',
      title: 'Local comercial estratégico',
      price: 'US$ 1.200/mes',
      location: 'Centro - San Miguel de Tucumán',
      bedrooms: 0,
      bathrooms: 1,
      area: '60m²',
      image: '/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png',
      type: 'alquiler' as const,
      propertyType: 'Local'
    },
    {
      id: '4',
      title: 'Casa familiar con jardín',
      price: 'US$ 320.000',
      location: 'Sur - San Miguel de Tucumán',
      bedrooms: 4,
      bathrooms: 3,
      area: '200m²',
      image: '/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png',
      type: 'venta' as const,
      propertyType: 'Casa'
    },
    {
      id: '5',
      title: 'Oficina moderna equipada',
      price: 'US$ 800/mes',
      location: 'Centro - San Miguel de Tucumán',
      bedrooms: 0,
      bathrooms: 1,
      area: '45m²',
      image: '/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png',
      type: 'alquiler' as const,
      propertyType: 'Oficina'
    },
    {
      id: '6',
      title: 'Departamento de lujo',
      price: 'US$ 420.000',
      location: 'Norte - San Miguel de Tucumán',
      bedrooms: 3,
      bathrooms: 2,
      area: '120m²',
      image: '/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png',
      type: 'venta' as const,
      propertyType: 'Apartamento'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Propiedades destacadas
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre las mejores oportunidades inmobiliarias seleccionadas especialmente para ti
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              {...property}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-primary-400 hover:bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Ver todas las propiedades
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
