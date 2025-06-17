
-- Esquema SQL para la base de datos inmobiliaria
-- Ejecutar en el SQL Editor de Supabase

-- Tabla de propiedades
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    operation_type VARCHAR(20) NOT NULL CHECK (operation_type IN ('venta', 'alquiler')),
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('casa', 'apartamento', 'oficina', 'local', 'terreno')),
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    construccion DECIMAL(8, 2),
    terreno DECIMAL(8, 2),
    address VARCHAR(255),
    neighborhood VARCHAR(100),
    city VARCHAR(100) DEFAULT 'San Miguel de Tucumán',
    province VARCHAR(100) DEFAULT 'Tucumán',
    country VARCHAR(100) DEFAULT 'Argentina',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    features TEXT[], -- Array de características (ej: ['garage', 'jardin', 'piscina'])
    images TEXT[], -- Array de URLs de imágenes
    featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'disponible' CHECK (status IN ('disponible', 'vendido', 'alquilado', 'reservado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabla de usuarios admin (para el panel de administración)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabla de consultas de clientes
CREATE TABLE IF NOT EXISTS client_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    message TEXT,
    inquiry_type VARCHAR(20) DEFAULT 'informacion' CHECK (inquiry_type IN ('informacion', 'visita', 'tasacion', 'contacto')),
    status VARCHAR(20) DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'contactado', 'cerrado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabla de favoritos (para futura funcionalidad)
CREATE TABLE IF NOT EXISTS favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    session_id VARCHAR(255), -- Para usuarios no registrados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_properties_operation_type ON properties(operation_type);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_neighborhood ON properties(neighborhood);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);
CREATE INDEX IF NOT EXISTS idx_client_inquiries_property_id ON client_inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_client_inquiries_status ON client_inquiries(status);

-- Insertar datos de ejemplo
INSERT INTO properties (
    title, description, price, operation_type, property_type, 
    bedrooms, bathrooms, construccion, address, neighborhood, 
    features, images, featured
) VALUES 
    (
        'Casa moderna en el centro',
        'Hermosa casa de 3 dormitorios ubicada en el corazón de la ciudad. Ideal para familias que buscan comodidad y proximidad a servicios.',
        250000,
        'venta',
        'casa',
        3,
        2,
        150,
        'Calle San Martín 123',
        'Centro',
        ARRAY['garage', 'jardin', 'cocina_equipada'],
        ARRAY['https://ejemplo.com/imagen1.jpg'],
        true
    ),
    (
        'Apartamento con vista panorámica',
        'Moderno apartamento de 2 dormitorios con increíbles vistas a la ciudad. Perfecto para profesionales jóvenes.',
        180000,
        'venta',
        'apartamento',
        2,
        1,
        80,
        'Av. Belgrano 456',
        'Norte',
        ARRAY['balcon', 'aire_acondicionado', 'seguridad_24h'],
        ARRAY['https://ejemplo.com/imagen2.jpg'],
        true
    ),
    (
        'Local comercial estratégico',
        'Excelente ubicación para tu negocio. Local comercial en zona de alto tránsito peatonal.',
        1200,
        'alquiler',
        'local',
        0,
        1,
        60,
        'Calle 25 de Mayo 789',
        'Centro',
        ARRAY['vidriera', 'acceso_discapacitados'],
        ARRAY['https://ejemplo.com/imagen3.jpg'],
        false
    );

-- RLS (Row Level Security) - Opcional para mayor seguridad
-- ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE client_inquiries ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública de propiedades disponibles
-- CREATE POLICY "Propiedades públicas" ON properties
--     FOR SELECT USING (status = 'disponible');

-- Política para permitir inserción de consultas
-- CREATE POLICY "Insertar consultas" ON client_inquiries
--     FOR INSERT WITH CHECK (true);
