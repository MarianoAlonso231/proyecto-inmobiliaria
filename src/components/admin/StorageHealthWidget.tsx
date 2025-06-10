'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getStorageStats } from '@/lib/supabase/cleanup';
import { HardDrive, AlertTriangle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';

interface StorageStats {
  totalFiles: number;
  referencedImages: number;
  orphanedImages: number;
  storageHealth: string;
  lastCheck: string;
}

interface Props {
  onViewDetails: () => void;
}

export function StorageHealthWidget({ onViewDetails }: Props) {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getStorageStats();
      if (result.success && result.stats) {
        setStats(result.stats);
      } else {
        setError(result.error || 'Error al cargar estadísticas');
      }
    } catch (err) {
      setError('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const getHealthBadge = (health: string) => {
    switch (health) {
      case 'excelente':
        return <Badge variant="default" className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Excelente</Badge>;
      case 'bueno':
        return <Badge variant="secondary" className="bg-blue-500 text-white">Bueno</Badge>;
      case 'regular':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Regular</Badge>;
      case 'requiere_atencion':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Requiere Atención</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excelente': return 'text-green-600';
      case 'bueno': return 'text-blue-600';
      case 'regular': return 'text-yellow-600';
      case 'requiere_atencion': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <HardDrive className="h-4 w-4" />
          Estado del Storage
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={loadStats}
          disabled={loading}
          className="h-8 w-8 p-0"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-red-600 mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={loadStats}>
              Reintentar
            </Button>
          </div>
        ) : stats ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Estado:</span>
              {getHealthBadge(stats.storageHealth)}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Total:</span>
                <span className="font-medium ml-1">{stats.totalFiles}</span>
              </div>
              <div>
                <span className="text-gray-600">Huérfanas:</span>
                <span className={`font-medium ml-1 ${getHealthColor(stats.storageHealth)}`}>
                  {stats.orphanedImages}
                </span>
              </div>
            </div>

            {stats.orphanedImages > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">
                  Se encontraron {stats.orphanedImages} imágenes huérfanas
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewDetails}
                  className="w-full text-xs h-7"
                >
                  Gestionar Storage
                </Button>
              </div>
            )}

            {stats.orphanedImages === 0 && (
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  Storage optimizado
                </div>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
} 