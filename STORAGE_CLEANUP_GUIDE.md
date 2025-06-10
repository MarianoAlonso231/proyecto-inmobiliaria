# 🧹 Guía de Limpieza del Storage de Imágenes

Esta guía explica cómo usar las herramientas desarrolladas para resolver el problema de imágenes huérfanas en el Storage de Supabase.

## 📋 Resumen del Problema

Las imágenes quedaron huérfanas en el Storage bucket `properties-images` después de eliminar propiedades de la base de datos. Estas herramientas permiten:

1. **Identificar** imágenes que no tienen referencia en la DB
2. **Limpiar** archivos huérfanos de forma segura  
3. **Prevenir** el problema en el futuro con eliminación segura

## 🛠️ Herramientas Disponibles

### 1. Funciones de Análisis y Limpieza (`src/lib/supabase/cleanup.ts`)

#### `findOrphanedImages()`
Analiza el Storage y la DB para encontrar imágenes huérfanas.

```typescript
const result = await findOrphanedImages();
if (result.success) {
  console.log(`Imágenes huérfanas: ${result.data.orphanedFiles.length}`);
}
```

#### `cleanupOrphanedImages(dryRun = true)`
Elimina imágenes huérfanas del Storage.

```typescript
// Simulación (seguro)
const simulation = await cleanupOrphanedImages(true);

// Limpieza real (¡cuidado!)
const cleanup = await cleanupOrphanedImages(false);
```

#### `deletePropertySafely(propertyId)`
Elimina una propiedad junto con sus imágenes del Storage.

```typescript
const result = await deletePropertySafely('uuid-de-la-propiedad');
```

#### `getStorageStats()`
Obtiene estadísticas del estado del Storage.

```typescript
const stats = await getStorageStats();
console.log(`Estado: ${stats.stats.storageHealth}`);
```

### 2. Script de Línea de Comandos (`src/scripts/storage-cleanup.ts`)

**Instalación de dependencias:**
```bash
npm install tsx@^4.7.0 --save-dev
```

**Comandos disponibles:**

```bash
# Analizar imágenes huérfanas
npm run storage:analyze

# Simulación de limpieza (seguro)
npm run storage:cleanup:dry

# Limpieza real (¡elimina archivos!)
npm run storage:cleanup:run

# Ver estadísticas
npm run storage:stats

# Mantenimiento completo
npm run storage:maintenance
```

### 3. Componente de Administración (`src/components/admin/StorageManager.tsx`)

Interfaz web para gestionar el Storage desde el panel de administración.

```tsx
import { StorageManager } from '@/components/admin/StorageManager';

export default function AdminPage() {
  return (
    <div>
      <StorageManager />
    </div>
  );
}
```

## 🚀 Guía de Uso Paso a Paso

### Paso 1: Análisis Inicial

**Desde línea de comandos:**
```bash
npm run storage:analyze
```

**Desde código:**
```typescript
import { findOrphanedImages } from '@/lib/supabase/cleanup';

const analysis = await findOrphanedImages();
console.log('Análisis:', analysis.data);
```

### Paso 2: Simulación de Limpieza

**Siempre simula antes de eliminar:**
```bash
npm run storage:cleanup:dry
```

Esto te mostrará qué archivos se eliminarían sin eliminarlos realmente.

### Paso 3: Limpieza Real

**⚠️ Solo después de confirmar la simulación:**
```bash
npm run storage:cleanup:run
```

### Paso 4: Verificación

```bash
npm run storage:stats
```

## 📊 Interpretación de Resultados

### Estados del Storage

- **Excelente**: Sin imágenes huérfanas
- **Bueno**: < 5 imágenes huérfanas  
- **Regular**: 5-19 imágenes huérfanas
- **Requiere Atención**: ≥ 20 imágenes huérfanas

### Ejemplo de Salida

```
📊 RESULTADOS DEL ANÁLISIS:
  Total archivos en Storage: 150
  Imágenes referenciadas en DB: 142
  Imágenes huérfanas: 8

🗑️ ARCHIVOS HUÉRFANOS ENCONTRADOS:
  1. 1749076766E1_2c49n8cg66.jpg
  2. 1749123456F2_3d58o9dh77.jpg
  ...
```

## 🔒 Seguridad y Mejores Prácticas

### ✅ Recomendaciones

1. **Siempre simula primero**: Usa `dryRun: true` antes de eliminar
2. **Backup**: Considera hacer respaldo de archivos importantes
3. **Horarios de mantenimiento**: Ejecuta limpieza en horarios de bajo tráfico
4. **Monitoreo regular**: Revisa estadísticas semanalmente
5. **Usa eliminación segura**: Para propiedades futuras, usa `deletePropertySafely()`

### ⚠️ Precauciones

- Las eliminaciones del Storage son **permanentes**
- Revisa la lista de archivos huérfanos antes de eliminar
- Ten variables de entorno configuradas correctamente
- No ejecutes múltiples limpiezas simultáneamente

## 🔧 Configuración Técnica

### Variables de Entorno Requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

### Estructura de URLs

Las URLs de imágenes siguen este patrón:
```
https://wxlzstrodefylrgzr.supabase.co/storage/v1/object/public/properties-images/1749076766E1_2c49n8cg66.jpg
```

### Estructura de la DB

```sql
-- Tabla properties
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  images TEXT[], -- Array JSON con URLs completas
  -- otros campos...
);
```

## 🐛 Solución de Problemas

### Error: "Variables de entorno no configuradas"
```bash
# Verifica que tengas las variables en .env.local
echo $NEXT_PUBLIC_SUPABASE_URL
```

### Error: "No se puede conectar a Supabase"
- Verifica las credenciales
- Confirma que el bucket `properties-images` existe
- Revisa los permisos del Storage

### Error: "Archivo no encontrado"
- El archivo ya fue eliminado por otro proceso
- No es un error crítico, continúa con el siguiente

## 📈 Automatización

### Cron Job (Opcional)

Para ejecutar mantenimiento automático:

```bash
# Agregar a crontab para ejecutar cada domingo a las 2 AM
0 2 * * 0 cd /ruta/proyecto && npm run storage:maintenance
```

### Integración con CI/CD

```yaml
# .github/workflows/storage-maintenance.yml
name: Storage Maintenance
on:
  schedule:
    - cron: '0 2 * * 0' # Domingos a las 2 AM
jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run storage:maintenance
```

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs en la consola
2. Verifica la conectividad a Supabase
3. Confirma que las variables de entorno están configuradas
4. Ejecuta `npm run storage:stats` para diagnosticar

---

**⚡ Tip**: Mantén el Storage limpio ejecutando análisis regulares y usando la eliminación segura para propiedades futuras. 