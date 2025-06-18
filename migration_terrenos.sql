-- Migración para agregar campos específicos de terrenos
-- Ejecutar en el SQL Editor de Supabase

-- Agregar nuevas columnas para características de terrenos
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS barrio_cerrado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS es_country BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS paga_expensas BOOLEAN DEFAULT FALSE;

-- Agregar comentarios para documentar los campos
COMMENT ON COLUMN properties.barrio_cerrado IS 'Indica si el terreno está ubicado en un barrio cerrado';
COMMENT ON COLUMN properties.es_country IS 'Indica si el terreno está ubicado en un country club';
COMMENT ON COLUMN properties.paga_expensas IS 'Indica si el terreno debe pagar expensas';

-- Crear índices para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_properties_barrio_cerrado ON properties(barrio_cerrado);
CREATE INDEX IF NOT EXISTS idx_properties_es_country ON properties(es_country);
CREATE INDEX IF NOT EXISTS idx_properties_paga_expensas ON properties(paga_expensas); 