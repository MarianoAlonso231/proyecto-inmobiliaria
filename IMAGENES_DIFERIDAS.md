# Sistema de Imágenes Diferidas

## 🚀 Problema Solucionado

Anteriormente, las imágenes se subían inmediatamente al seleccionarlas en el formulario, **antes** de guardar la propiedad. Esto causaba:

- ❌ **Imágenes huérfanas** si el usuario cancelaba el formulario
- ❌ **Imágenes huérfanas** si había un error al guardar la propiedad  
- ❌ **Desperdicio de espacio** en el Storage
- ❌ **Pérdida de imágenes** si el usuario cambiaba de imagen

## ✅ Nueva Solución

Ahora las imágenes se manejan de forma **diferida**:

1. **Selección**: Las imágenes se almacenan temporalmente como `File` objects
2. **Preview**: Se muestran usando `URL.createObjectURL()` 
3. **Subida**: Se suben al Storage **solo cuando se guarda** la propiedad
4. **Limpieza**: Se limpian automáticamente si se cancela

## 🏗️ Componentes Nuevos

### `ImageUploaderDeferred`

Reemplaza al `ImageUploader` anterior. Características:

- **Tipo de datos**: `ImageItem[]` en lugar de `string`
- **Preview local**: Usa blob URLs para archivos nuevos
- **Indicadores visuales**: Muestra "Nuevo" vs "Guardado"
- **Validación**: Tamaño máximo 5MB, solo imágenes
- **Límite**: Hasta 10 imágenes por propiedad

### Tipo `ImageItem`

```typescript
interface ImageItem {
  id: string;
  type: 'file' | 'url';    // Archivo nuevo o URL existente
  file?: File;             // Archivo local (solo para 'file')
  url?: string;            // URL guardada (solo para 'url') 
  preview: string;         // URL de preview (blob o URL directa)
}
```

## 🔄 Flujo de Trabajo

### Crear Nueva Propiedad

1. Usuario selecciona imágenes → `ImageItem[]` con `type: 'file'`
2. Se muestran previews usando blob URLs
3. Usuario guarda propiedad → Se suben las imágenes
4. Se guarda la propiedad con las URLs reales
5. Se limpian los blob URLs automáticamente

### Editar Propiedad Existente

1. Se cargan imágenes existentes → `ImageItem[]` con `type: 'url'`
2. Usuario puede agregar nuevas → Se mezclan `'file'` y `'url'`
3. Usuario guarda → Solo se suben las imágenes nuevas (`'file'`)
4. Se combinan URLs existentes + nuevas URLs

## 📋 Funciones de Utilidad

### `urlStringToImageItems(urlString: string): ImageItem[]`
Convierte string de URLs separadas por comas a `ImageItem[]`

### `imageItemsToUrlString(imageItems: ImageItem[]): string`  
Convierte `ImageItem[]` a string de URLs (solo las guardadas)

### `getFilesToUpload(imageItems: ImageItem[]): File[]`
Extrae solo los archivos que necesitan subirse

## 🔧 Actualización del Hook `useProperties`

### Cambios en `PropertyFormData`
```typescript
// Antes
images: string;

// Ahora  
images: ImageItem[];
```

### Lógica de Subida Actualizada

```typescript
// 1. Filtrar archivos a subir
const filesToUpload = formData.images.filter(item => 
  item.type === 'file' && item.file
);

// 2. Subir cada archivo
for (const imageItem of filesToUpload) {
  const uploadResult = await uploadImage(imageItem.file);
  // Manejar resultado...
}

// 3. Combinar URLs existentes + nuevas
const existingUrls = formData.images
  .filter(item => item.type === 'url' && item.url)
  .map(item => item.url!);

const allImageUrls = [...existingUrls, ...uploadedImageUrls];
```

## 🎨 Interfaz de Usuario

### Indicadores Visuales

- **🔵 "Nuevo"**: Imagen seleccionada pero no subida
- **🟢 "Guardado"**: Imagen ya guardada en Storage  
- **💡 Info**: "Estas imágenes se subirán cuando guardes la propiedad"

### Estados del Formulario

- **Selección**: Muestra contador `x / 10` imágenes
- **Carga**: Botón deshabilitado durante subida
- **Error**: Mensajes específicos por imagen
- **Cancelar**: Limpia blob URLs automáticamente

## 🔒 Gestión de Memoria

### Limpieza Automática

```typescript
// En useEffect cleanup
useEffect(() => {
  return () => {
    value.forEach(item => {
      if (item.type === 'file' && item.preview.startsWith('blob:')) {
        URL.revokeObjectURL(item.preview);
      }
    });
  };
}, []);
```

### Prevención de Memory Leaks

- ✅ Blob URLs se liberan al desmontar componente
- ✅ Blob URLs se liberan al eliminar imagen
- ✅ Blob URLs se liberan al limpiar formulario

## 🚫 Prevención de Imágenes Huérfanas

### Escenarios Cubiertos

1. **Usuario cancela formulario** → No se sube nada
2. **Error al guardar propiedad** → No se sube nada  
3. **Usuario cambia imagen** → Solo se sube la final
4. **Usuario sale sin guardar** → No se sube nada

### Comparación

| Escenario | Sistema Anterior | Sistema Nuevo |
|-----------|------------------|---------------|
| Selecciona imagen | ❌ Sube inmediatamente | ✅ Solo preview local |
| Cancela formulario | ❌ Imagen huérfana | ✅ No se sube nada |
| Error al guardar | ❌ Imagen huérfana | ✅ No se sube nada |
| Cambia imagen | ❌ Imagen anterior huérfana | ✅ Solo sube la final |

## 🎯 Beneficios

- ✅ **Cero imágenes huérfanas** por formularios cancelados
- ✅ **Mejor UX**: Preview inmediato sin espera
- ✅ **Ahorro de Storage**: Solo se suben imágenes confirmadas  
- ✅ **Transacciones atómicas**: Propiedad + imágenes juntas
- ✅ **Gestión de memoria**: Limpieza automática de blobs
- ✅ **Compatibilidad**: Funciona con imágenes existentes

## 🔄 Migración Automática

El sistema es **retrocompatible**:

- Propiedades existentes se cargan normalmente
- URLs existentes se convierten a `ImageItem` tipo `'url'`
- No se requiere migración de datos
- Funciona con el sistema de limpieza existente

## 🛠️ Testing

Para probar el nuevo sistema:

1. **Crear propiedad nueva** → Seleccionar imágenes → Verificar que no se suben hasta guardar
2. **Cancelar formulario** → Verificar que no quedan imágenes huérfanas
3. **Editar propiedad** → Agregar/quitar imágenes → Verificar manejo correcto
4. **Error simulado** → Verificar que imágenes no se suben en caso de error

## 📈 Monitoreo

El sistema de limpieza existente sigue funcionando para detectar cualquier imagen huérfana que pueda quedar (aunque no debería haber ninguna con el nuevo sistema).

```bash
# Análisis de Storage
npm run storage:analyze

# Stats de Storage  
npm run storage:stats
``` 