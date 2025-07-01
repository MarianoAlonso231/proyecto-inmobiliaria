'use client';

import { useCallback } from 'react';
import { event, pageview } from '@/components/GoogleAnalytics';

interface TrackEventParams {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

interface TrackPageViewParams {
  page_title?: string;
  page_location?: string;
  content_group1?: string;
}

export function useGoogleAnalytics() {
  // Función para trackear eventos
  const trackEvent = useCallback(({
    action,
    category,
    label,
    value,
    custom_parameters = {},
  }: TrackEventParams) => {
    event(action, {
      event_category: category,
      event_label: label,
      value: value,
      ...custom_parameters,
    });
  }, []);

  // Función para trackear page views manualmente
  const trackPageView = useCallback((
    ga_id: string,
    url: string,
    params?: TrackPageViewParams
  ) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', ga_id, {
        page_path: url,
        page_title: params?.page_title,
        page_location: params?.page_location,
        content_group1: params?.content_group1,
        send_page_view: true,
      });
    }
  }, []);

  // Función para trackear conversiones
  const trackConversion = useCallback((
    conversionId: string,
    value?: number,
    currency: string = 'EUR'
  ) => {
    event('conversion', {
      send_to: conversionId,
      value: value,
      currency: currency,
    });
  }, []);

  // Funciones específicas para el negocio inmobiliario
  const trackPropertyView = useCallback((propertyId: string, propertyType: string, price?: number) => {
    trackEvent({
      action: 'view_property',
      category: 'Properties',
      label: propertyId,
      value: price,
      custom_parameters: {
        property_type: propertyType,
        property_id: propertyId,
      },
    });
  }, [trackEvent]);

  const trackPropertyInquiry = useCallback((propertyId: string, inquiryType: string) => {
    trackEvent({
      action: 'property_inquiry',
      category: 'Lead Generation',
      label: propertyId,
      custom_parameters: {
        inquiry_type: inquiryType,
        property_id: propertyId,
      },
    });
  }, [trackEvent]);

  const trackContactForm = useCallback((formType: string, propertyId?: string) => {
    trackEvent({
      action: 'contact_form_submit',
      category: 'Lead Generation',
      label: formType,
      custom_parameters: {
        form_type: formType,
        property_id: propertyId,
      },
    });
  }, [trackEvent]);

  const trackSearch = useCallback((searchTerm: string, filters?: Record<string, any>) => {
    trackEvent({
      action: 'search',
      category: 'Property Search',
      label: searchTerm,
      custom_parameters: {
        search_term: searchTerm,
        ...filters,
      },
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackConversion,
    trackPropertyView,
    trackPropertyInquiry,
    trackContactForm,
    trackSearch,
  };
} 