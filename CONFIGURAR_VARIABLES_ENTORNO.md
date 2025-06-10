# 🔧 Configuración de Variables de Entorno

## Problema Actual
Estás viendo este error:
```
Error: @supabase/ssr: Your project's URL and API key are required to create a Supabase client!
```

## Solución

### 1. Crear archivo `.env.local`
Crea un archivo llamado `.env.local` en la raíz de tu proyecto (al mismo nivel que `package.json`) con el siguiente contenido:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase_aqui
```

### 2. Encontrar tus valores de Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a **Settings** > **API**
3. Copia los valores:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** > **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Ejemplo de configuración
```env
NEXT_PUBLIC_SUPABASE_URL=https://wxlzstrodefylrgzr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4bHpzdHJvZGVmeWxyZ3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMzIyNzEsImV4cCI6MjA1MDkwODI3MX0.1234567890abcdef...
```

### 4. Verificar configuración
Una vez configurado, reinicia el servidor de desarrollo:
```bash
npm run dev
```

### 5. Probar las herramientas de Storage
Después de configurar las variables, podrás:
- Acceder al panel de administración
- Usar las herramientas de Storage desde la nueva pestaña "Storage"
- Ejecutar los scripts de línea de comandos

## ⚠️ Importante
- El archivo `.env.local` está en `.gitignore` y no se subirá a git
- Nunca compartas estas claves públicamente
- Usa variables de entorno diferentes para producción 