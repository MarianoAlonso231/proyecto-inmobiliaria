import { useCallback, useRef } from 'react';

/**
 * Hook para debouncing de funciones
 * Evita llamadas excesivas y mejora el rendimiento
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // Limpiar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Crear nuevo timeout
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  // Cleanup al desmontar
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return debouncedCallback;
}

/**
 * Hook para throttling de funciones
 * Limita la frecuencia de ejecución
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      // Si ha pasado suficiente tiempo, ejecutar inmediatamente
      if (now - lastRunRef.current >= delay) {
        lastRunRef.current = now;
        callback(...args);
      } else {
        // Si no, programar para ejecutar cuando sea el momento
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        const remainingTime = delay - (now - lastRunRef.current);
        timeoutRef.current = setTimeout(() => {
          lastRunRef.current = Date.now();
          callback(...args);
        }, remainingTime);
      }
    },
    [callback, delay]
  ) as T;

  return throttledCallback;
} 