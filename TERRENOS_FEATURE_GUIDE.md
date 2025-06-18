# Guía de Implementación: Características Específicas para Terrenos

## 📋 Resumen de Cambios

Se han implementado características específicas para propiedades de tipo "terreno", reemplazando dormitorios, baños y metros cuadrados de construcción por:

- ✅ **Barrio Cerrado** (Si/No)
- ✅ **Country Club** (Si/No)  
- ✅ **Paga Expensas** (Si/No)

## 🗄️ 1. Cambios en la Base de Datos

### Migración SQL (OBLIGATORIA)

**⚠️ IMPORTANTE: Ejecutar esta migración en Supabase antes de desplegar el código**

```sql
-- Archivo: migration_terrenos.sql
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
```

### Nuevos Campos en la Tabla `properties`

| Campo | Tipo | Descripción | Default |
|-------|------|-------------|---------|
| `barrio_cerrado` | BOOLEAN | Si el terreno está en un barrio cerrado | FALSE |
| `es_country` | BOOLEAN | Si el terreno está en un country club | FALSE |  
| `paga_expensas` | BOOLEAN | Si el terreno paga expensas | FALSE |

## 🔧 2. Cambios en el Código

### Archivos Modificados

#### **Backend/Hooks:**
- ✅ `src/hooks/useProperties.ts`
  - Actualizada interfaz `Property`
  - Actualizada interfaz `PropertyFormData` 
  - Actualizado `initialFormData`
  - Actualizadas funciones `createProperty`, `updateProperty`, `propertyToFormData`

#### **Formularios:**
- ✅ `src/components/PropertyForm.tsx`
  - Agregados checkboxes específicos para terrenos
  - Sección condicional que solo aparece cuando `property_type === 'terreno'`

#### **Visualización:**
- ✅ `src/components/PropertyCard.tsx`
  - Lógica condicional para mostrar características según tipo de propiedad
  - Para terrenos: Barrio Cerrado, Country, Expensas
  - Para otras propiedades: Dormitorios, Baños, Área

#### **Páginas que usan PropertyCard:**
- ✅ `src/components/FeaturedProperties.tsx`
- ✅ `src/app/ventas/page.tsx`
- ✅ `src/app/alquileres/page.tsx`
- ✅ `src/app/propiedades/page.tsx`

#### **Utilidades:**
- ✅ `src/lib/utils.ts`
  - Función `getPropertyArea()` para mostrar área correcta según tipo de propiedad

## 🎨 3. Interfaz de Usuario

### En PropertyCard para Terrenos:
```
[🛡️ B. Cerrado]  [🌲 Country]  [💰 C/Expensas]
```

### En PropertyForm para Terrenos:
```
┌─ Características del Terreno ─────────────────┐
│ ☑️ Barrio Cerrado    ☑️ Country Club    ☐ Paga Expensas │
└─────────────────────────────────────────────┘
```

## 🚀 4. Instrucciones de Despliegue

### Paso 1: Migración de Base de Datos
1. Abrir Supabase Dashboard
2. Ir a SQL Editor
3. Ejecutar el contenido de `migration_terrenos.sql`
4. Verificar que las columnas se agregaron correctamente

### Paso 2: Despliegue del Código
1. El código ya está actualizado y listo
2. Hacer deploy normalmente
3. Las características aparecerán automáticamente para terrenos

### Paso 3: Verificación
1. Crear un nuevo terreno en el panel admin
2. Verificar que aparecen los checkboxes específicos
3. Confirmar que en la tarjeta se muestran las características correctas

## 📊 4. Comportamiento por Tipo de Propiedad

| Tipo de Propiedad | Características Mostradas |
|-------------------|---------------------------|
| **Casa** | Dormitorios, Baños, m² Construcción |
| **Departamento** | Dormitorios, Baños, m² Construcción |
| **Oficina** | Dormitorios, Baños, m² Construcción |
| **Local** | Dormitorios, Baños, m² Construcción |
| **🏞️ Terreno** | **Barrio Cerrado, Country, Expensas** |

## 🔍 5. Detalles Técnicos

### Área Mostrada según Tipo:
- **Terrenos**: Muestra `terreno` (m² terreno) 
- **Otras propiedades**: Muestra `construccion` (m² construcción)

### Iconos Utilizados:
- 🛡️ `Shield` - Barrio Cerrado
- 🌲 `TreePine` - Country Club  
- 💰 `DollarSign` - Paga Expensas

### Estados de los Checkboxes:
- ✅ Activo: "B. Cerrado", "Country", "C/Expensas"
- ❌ Inactivo: "No B.C.", "No Country", "S/Expensas"

## ⚠️ Consideraciones Importantes

1. **Compatibilidad**: Los terrenos existentes tendrán todas las características en `FALSE` por defecto
2. **Área**: Se muestra automáticamente el área del terreno para tipo "terreno"
3. **Formulario**: Los checkboxes solo aparecen cuando se selecciona "Terreno" como tipo
4. **Retrocompatibilidad**: Las propiedades existentes no se ven afectadas

## 🔧 Solución de Problemas

### Si no aparecen los checkboxes:
- Verificar que el tipo de propiedad esté seleccionado como "terreno"
- Revisar que la migración SQL se ejecutó correctamente

### Si hay errores TypeScript:
- Asegurarse de que todos los archivos estén actualizados
- Verificar que las nuevas propiedades se estén pasando en PropertyCard

### Si no se guardan las características:
- Verificar que la migración SQL se ejecutó
- Revisar que las funciones `createProperty` y `updateProperty` incluyen los nuevos campos

---

✅ **Los cambios están listos para producción una vez ejecutada la migración SQL** 