# Configurar Bucket de Supabase

## Pasos para crear el bucket 'properties-images':

### 1. Ir a Supabase Dashboard
- Accede a https://app.supabase.com
- Selecciona tu proyecto

### 2. Crear el bucket
- Ve a **Storage** en el menú lateral
- Haz clic en **"New bucket"**
- Nombre: `properties-images`
- **Marcar como "Public bucket"** ✅
- Crear bucket

### 3. Configurar permisos (Policies)
Ve a la pestaña **Policies** del bucket y agrega:

#### Permitir subir imágenes (usuarios autenticados):
```sql
CREATE POLICY "Admin upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'properties-images');
```

#### Permitir ver imágenes (público):
```sql
CREATE POLICY "Public view" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'properties-images');
```

#### Permitir eliminar imágenes (usuarios autenticados):
```sql
CREATE POLICY "Admin delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'properties-images');
```

## ¡Listo! 
Ahora puedes subir imágenes desde el dashboard y se guardarán automáticamente en Supabase Storage.

## URLs generadas:
Las imágenes tendrán URLs como:
```
https://tu-proyecto.supabase.co/storage/v1/object/public/properties-images/imagen.jpg
``` 