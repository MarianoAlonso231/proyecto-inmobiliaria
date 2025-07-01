# Configuración de Google Analytics 4

## Configuración Inicial

### 1. Obtener el Measurement ID de Google Analytics 4

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Crea una nueva propiedad o selecciona una existente
3. Ve a **Admin** → **Property Settings** → **Data Streams**
4. Selecciona tu stream de datos web o crea uno nuevo
5. Copia el **Measurement ID** (formato: `G-XXXXXXXXXX`)

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**⚠️ Importante:** Reemplaza `G-XXXXXXXXXX` con tu Measurement ID real.

### 3. Uso en el Código

El componente GoogleAnalytics ya está integrado en el layout principal y funciona automáticamente. También puedes usar el hook personalizado:

```typescript
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';

function MiComponente() {
  const { 
    trackEvent, 
    trackPropertyView, 
    trackContactForm,
    trackSearch 
  } = useGoogleAnalytics();

  const handlePropertyClick = (id: string, type: string, price: number) => {
    trackPropertyView(id, type, price);
  };

  const handleContactSubmit = () => {
    trackContactForm('contact_page');
  };

  return (
    // Tu componente
  );
}
```

## Eventos Disponibles

### Eventos Generales
- `trackEvent()` - Trackear cualquier evento personalizado
- `trackPageView()` - Trackear page views manualmente
- `trackConversion()` - Trackear conversiones

### Eventos Específicos del Negocio Inmobiliario
- `trackPropertyView(propertyId, propertyType, price)` - Vista de propiedad
- `trackPropertyInquiry(propertyId, inquiryType)` - Consulta sobre propiedad
- `trackContactForm(formType, propertyId?)` - Envío de formulario de contacto
- `trackSearch(searchTerm, filters?)` - Búsqueda de propiedades

## Debugging

Para verificar que GA4 está funcionando:

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña **Network**
3. Filtra por `google-analytics` o `gtag`
4. Navega por tu sitio y verás las llamadas a GA4

También puedes instalar la extensión [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) para Chrome.

## GDPR y Consentimiento

El código incluye configuración básica de consentimiento. Para cumplir con GDPR completamente, considera implementar:

1. Un banner de cookies
2. Gestión de consentimiento más granular
3. Posibilidad de revocar el consentimiento

Ejemplo de implementación de consentimiento:

```typescript
// Denegar por defecto
gtag('consent', 'default', {
  'analytics_storage': 'denied'
});

// Otorgar después del consentimiento del usuario
gtag('consent', 'update', {
  'analytics_storage': 'granted'
});
``` 