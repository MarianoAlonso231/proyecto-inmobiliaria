'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

interface GoogleAnalyticsProps {
  ga_id: string;
}

// Función para trackear page views
export function pageview(ga_id: string, url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', ga_id, {
      page_path: url,
      send_page_view: true,
    });
  }
}

// Función para trackear eventos personalizados
export function event(action: string, parameters?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      ...parameters,
    });
  }
}

export default function GoogleAnalytics({ ga_id }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!ga_id) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Trackear page view cuando cambie la ruta
    pageview(ga_id, url);
  }, [pathname, searchParams, ga_id]);

  if (!ga_id) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${ga_id}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', {
              'analytics_storage': 'granted'
            });
            gtag('config', '${ga_id}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `,
        }}
      />
    </>
  );
} 