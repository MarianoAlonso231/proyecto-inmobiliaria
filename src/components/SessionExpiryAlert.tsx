'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Clock, RefreshCw, X } from 'lucide-react';
import { useSessionMonitor } from '@/hooks/useSessionMonitor';

export function SessionExpiryAlert() {
  const { sessionStatus, showExpiryWarning, refreshSession, dismissWarning } = useSessionMonitor();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Formatear tiempo restante
  const formatTimeRemaining = (seconds: number): string => {
    if (seconds <= 0) return 'Expirada';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  // Manejar renovación manual
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const success = await refreshSession();
      if (!success) {
        // Si no se puede renovar, redirigir al login
        window.location.href = '/admin/login';
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // No mostrar si no hay advertencia o si la sesión no es válida
  if (!showExpiryWarning || !sessionStatus.isValid) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert className="border-amber-200 bg-amber-50 text-amber-800">
        <Clock className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium mb-1">Tu sesión expirará pronto</p>
            <p className="text-sm">
              Tiempo restante: {formatTimeRemaining(sessionStatus.expiresIn)}
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-white hover:bg-amber-100"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Renovando...' : 'Renovar'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={dismissWarning}
              className="hover:bg-amber-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
} 