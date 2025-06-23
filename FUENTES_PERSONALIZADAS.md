# Fuentes Personalizadas - Montserrat y Open Sans

## ¿Qué se implementó?

Se configuraron fuentes personalizadas Google Fonts para mejorar la tipografía del sitio web:
- **Montserrat**: Para títulos y encabezados
- **Open Sans**: Para texto del cuerpo y párrafos

## Archivos modificados

### 1. `tailwind.config.ts` - Configuración de fuentes
```typescript
fontFamily: {
  'heading': ['var(--font-heading)', 'Montserrat', 'sans-serif'],
  'body': ['var(--font-body)', 'Open Sans', 'sans-serif'],
  'sans': ['var(--font-body)', 'Open Sans', 'sans-serif'], // Por defecto
},
```

### 2. `src/app/layout.tsx` - Importación de fuentes
```typescript
import { Montserrat, Open_Sans } from "next/font/google";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-heading",
  display: 'swap',
});

const openSans = Open_Sans({ 
  subsets: ["latin"],
  variable: "--font-body",
  display: 'swap',
});
```

### 3. `src/app/propiedades/[id]/page.tsx` - Aplicación de fuentes

#### Títulos con Montserrat (`font-heading`):
- ✅ Título principal de la propiedad
- ✅ "Descripción de la Propiedad"
- ✅ "Características"
- ✅ "Ubicación"
- ✅ Precio de la propiedad
- ✅ Nombres de agentes
- ✅ Estadísticas numéricas (dormitorios, baños, m²)

#### Texto del cuerpo con Open Sans (`font-body`):
- ✅ Descripción de la propiedad
- ✅ Dirección y ubicación
- ✅ Características listadas
- ✅ Información de contacto
- ✅ Etiquetas descriptivas
- ✅ Textos informativos

## Clases CSS disponibles

### Para títulos y encabezados:
```css
.font-heading /* Montserrat */
```

### Para texto del cuerpo:
```css
.font-body /* Open Sans */
```

### Por defecto:
```css
.font-sans /* Open Sans por defecto */
```

## Ejemplos de uso

### En componentes React:
```jsx
{/* Título con Montserrat */}
<h1 className="text-3xl font-bold font-heading">
  {property.title}
</h1>

{/* Texto del cuerpo con Open Sans */}
<p className="text-gray-600 font-body">
  {property.description}
</p>

{/* Estadística numérica con Montserrat */}
<div className="text-2xl font-bold font-heading">
  {property.bedrooms}
</div>

{/* Etiqueta descriptiva con Open Sans */}
<div className="text-sm text-gray-600 font-body">
  Dormitorios
</div>
```

## Beneficios implementados

### Jerarquía visual mejorada:
- **Montserrat** para títulos: Fuente moderna y elegante que destaca
- **Open Sans** para texto: Excelente legibilidad en párrafos largos

### Rendimiento optimizado:
- Carga con `display: 'swap'` para evitar bloqueo
- Variables CSS para mejor performance
- Fallbacks definidos para compatibilidad

### Consistencia tipográfica:
- Sistema de fuentes coherente en toda la aplicación
- Fácil mantenimiento con clases utilitarias

## Páginas afectadas

### ✅ Páginas de detalle de propiedades (`/propiedades/[id]`):
- Título principal
- Descripción detallada
- Características y amenidades
- Información de ubicación
- Datos del agente
- Precio y estadísticas

### 📝 Para implementar en futuras páginas:
- Listados de propiedades
- Homepage
- Formularios de contacto
- Panel de administración

## Configuración técnica

### Variables CSS generadas:
```css
:root {
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Open Sans', sans-serif;
}
```

### Clases Tailwind disponibles:
- `font-heading` → Montserrat
- `font-body` → Open Sans
- `font-sans` → Open Sans (por defecto)

## Testing y verificación

### Para verificar que las fuentes funcionan:
1. Abrir DevTools en el navegador
2. Inspeccionar un título (debe mostrar Montserrat)
3. Inspeccionar texto del cuerpo (debe mostrar Open Sans)
4. Verificar que las fuentes se carguen desde Google Fonts

### Comandos útiles:
```bash
# Verificar si las fuentes están cargando
console.log(document.fonts.status)

# Ver todas las fuentes cargadas
Array.from(document.fonts).map(font => font.family)
```

## Próximas mejoras sugeridas

1. **Expandir a otras páginas**: Aplicar las fuentes al resto del sitio
2. **Pesos adicionales**: Configurar más pesos de fuente si es necesario
3. **Fuentes para iconos**: Considerar una fuente de iconos si se requiere
4. **Preload crítico**: Precargar fuentes para el above-the-fold
5. **Modo oscuro**: Adaptar las fuentes para tema oscuro si se implementa

## Notas de compatibilidad

- ✅ Todos los navegadores modernos
- ✅ Dispositivos móviles y desktop
- ✅ Diferentes resoluciones
- ✅ Accesibilidad mantenida
- ✅ SEO friendly (no impacta el renderizado inicial)

La implementación mejora significativamente la experiencia visual del sitio web inmobiliario, proporcionando una tipografía profesional y legible. 