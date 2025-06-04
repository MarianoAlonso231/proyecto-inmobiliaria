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
      images: [
        '/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
      ],
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
      images: [
        '/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
      ],
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
      images: [
        '/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
      ],
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
      images: [
        '/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600563438938-a42b2ce2f2f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
      ],
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
      images: [
        '/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1497366412874-3415097a27e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
      ],
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
      images: [
        '/lovable-uploads/9129e3cd-5c03-4c9c-87c6-dceb873aae80.png',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
      ],
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
              description="Hermosa propiedad con excelente ubicación y comodidades modernas. Ideal para familias que buscan confort y tranquilidad."
              yearBuilt={2020}
              garage={true}
              garden={property.propertyType === 'Casa'}
              pool={false}
              security={true}
              gym={false}
              wifi={true}
              furnished={false}
              pets={property.propertyType === 'Casa'}
              features={['Luminoso', 'Bien ventilado', 'Cerca del transporte público']}
              address={property.location}
              neighborhood={property.location.split(' - ')[0]}
              contactName="María González"
              contactPhone="+54 381 506-3361"
              contactEmail="info@inmobi.com"
              images={property.images}
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
