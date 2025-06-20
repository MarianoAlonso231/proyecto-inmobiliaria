'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface LoadingTimeoutWarningProps {
  isLoading: boolean;
  timeoutSeconds?: number;
  onTimeout?: () => void;
}

export function LoadingTimeoutWarning({ 
  isLoading, 
  timeoutSeconds = 15, 
  onTimeout 
}: LoadingTimeoutWarningProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setShowWarning(false);
      setTimeElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1;
        
        // Mostrar advertencia después del tiempo especificado
        if (newTime >= timeoutSeconds && !showWarning) {
          setShowWarning(true);
          onTimeout?.();
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading, timeoutSeconds, onTimeout, showWarning]);

  if (!isLoading || !showWarning) {
    return null;
  }

  return (
    <Alert className="mt-4 border-amber-200 bg-amber-50">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <div className="space-y-2">
          <p className="font-medium">
            La operación está tardando más de lo esperado...
          </p>
          <p className="text-sm">
            Tiempo transcurrido: {timeElapsed} segundos
          </p>
          <p className="text-sm">
            Si continúa sin respuesta, verifica tu conexión a internet y considera recargar la página.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
} 