export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const isAnalyticsEnabled = () => {
  return Boolean(GA_MEASUREMENT_ID && typeof window !== 'undefined');
};

export const getGoogleAnalyticsId = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics Measurement ID no está configurado. Agrega NEXT_PUBLIC_GA_MEASUREMENT_ID a tu archivo .env.local');
    return '';
  }
  return GA_MEASUREMENT_ID;
}; 