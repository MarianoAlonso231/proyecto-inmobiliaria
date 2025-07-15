-- Migración para agregar el campo is_monoambiente
-- Ejecutar en el SQL Editor de Supabase

-- Agregar el campo is_monoambiente para identificar departamentos monoambiente
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS is_monoambiente BOOLEAN DEFAULT FALSE;

-- Agregar un índice para el nuevo campo para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_properties_is_monoambiente ON properties(is_monoambiente);

-- Comentario para documentar el campo
COMMENT ON COLUMN properties.is_monoambiente IS 'Indica si un departamento es monoambiente (solo aplica para property_type = apartamento)';

-- Verificar que la migración se ejecutó correctamente
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'properties' 
    AND column_name = 'is_monoambiente'; 