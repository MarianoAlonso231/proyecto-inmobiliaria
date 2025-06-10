'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  findOrphanedImages, 
  cleanupOrphanedImages, 
  getStorageStats,
  deletePropertySafely 
} from '@/lib/supabase/cleanup';
import { Loader2, Trash2, Eye, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';

interface StorageStats {
  totalFiles: number;
  referencedImages: number;
  orphanedImages: number;
  storageHealth: string;
  lastCheck: string;
}

interface OrphanAnalysis {
  totalFilesInStorage: number;
  totalReferencedImages: number;
  orphanedFiles: string[];
  referencedFiles: string[];
}

export function StorageManager() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [orphanAnalysis, setOrphanAnalysis] = useState<OrphanAnalysis | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error' | 'warning', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const loadStats = async () => {
    setLoading(true);
    try {
      const result = await getStorageStats();
      if (result.success && result.stats) {
        setStats(result.stats);
        showMessage('success', 'Estadísticas cargadas correctamente');
      } else {
        showMessage('error', result.error || 'Error al cargar estadísticas');
      }
    } catch (error) {
      showMessage('error', 'Error inesperado al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const analyzeOrphans = async () => {
    setLoading(true);
    try {
      const result = await findOrphanedImages();
      if (result.success && result.data) {
        setOrphanAnalysis(result.data);
        showMessage('success', `Análisis completado: ${result.data.orphanedFiles.length} imágenes huérfanas encontradas`);
      } else {
        showMessage('error', result.error || 'Error al analizar imágenes huérfanas');
      }
    } catch (error) {
      showMessage('error', 'Error inesperado durante el análisis');
    } finally {
      setLoading(false);
    }
  };

  const cleanupOrphans = async (dryRun: boolean = true) => {
    setLoading(true);
    try {
      const result = await cleanupOrphanedImages(dryRun);
      if (result.success) {
        const action = dryRun ? 'simularían' : 'eliminaron';
        showMessage('success', `${dryRun ? 'Simulación' : 'Limpieza'} completada: ${result.deletedCount} archivos se ${action}`);
        
        // Recargar estadísticas después de la limpieza
        if (!dryRun) {
          await loadStats();
          setOrphanAnalysis(null);
        }
      } else {
        showMessage('error', result.error || 'Error durante la limpieza');
      }
    } catch (error) {
      showMessage('error', 'Error inesperado durante la limpieza');
    } finally {
      setLoading(false);
    }
  };

  const getHealthBadge = (health: string) => {
    switch (health) {
      case 'excelente':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Excelente</Badge>;
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Storage</h2>
        <Button onClick={loadStats} disabled={loading} variant="outline">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <BarChart3 className="w-4 h-4 mr-2" />}
          Actualizar Estadísticas
        </Button>
      </div>

      {message && (
        <Alert className={message.type === 'error' ? 'border-red-500' : message.type === 'warning' ? 'border-yellow-500' : 'border-green-500'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Estadísticas Generales */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Estadísticas del Storage
              {getHealthBadge(stats.storageHealth)}
            </CardTitle>
            <CardDescription>
              Última actualización: {new Date(stats.lastCheck).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalFiles}</div>
                <div className="text-sm text-gray-600">Total de archivos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.referencedImages}</div>
                <div className="text-sm text-gray-600">Imágenes referenciadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.orphanedImages}</div>
                <div className="text-sm text-gray-600">Imágenes huérfanas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Análisis de Imágenes Huérfanas */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Imágenes Huérfanas</CardTitle>
          <CardDescription>
            Encuentra y gestiona archivos que no están siendo referenciados por ninguna propiedad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={analyzeOrphans} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            Analizar Imágenes Huérfanas
          </Button>

          {orphanAnalysis && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <strong>Archivos en Storage:</strong> {orphanAnalysis.totalFilesInStorage}
                </div>
                <div>
                  <strong>Archivos huérfanos:</strong> {orphanAnalysis.orphanedFiles.length}
                </div>
              </div>

              {orphanAnalysis.orphanedFiles.length > 0 && (
                <>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Se encontraron {orphanAnalysis.orphanedFiles.length} archivos huérfanos que pueden ser eliminados.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Archivos huérfanos encontrados:</h4>
                    <div className="max-h-40 overflow-y-auto bg-gray-50 p-3 rounded border text-sm">
                      {orphanAnalysis.orphanedFiles.map((file, index) => (
                        <div key={index} className="py-1">
                          {index + 1}. {file}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => cleanupOrphans(true)} disabled={loading} variant="outline">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                      Simular Limpieza
                    </Button>
                    <Button onClick={() => cleanupOrphans(false)} disabled={loading} variant="destructive">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                      Eliminar Archivos Huérfanos
                    </Button>
                  </div>
                </>
              )}

              {orphanAnalysis.orphanedFiles.length === 0 && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    ¡Excelente! No se encontraron imágenes huérfanas. El Storage está limpio.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información y Recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Mejores Prácticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Análisis regular:</strong> Ejecuta el análisis de imágenes huérfanas semanalmente</p>
            <p>• <strong>Simula antes de limpiar:</strong> Siempre usa la simulación antes de eliminar archivos</p>
            <p>• <strong>Backup:</strong> Considera hacer respaldo antes de eliminar grandes cantidades de archivos</p>
            <p>• <strong>Monitoreo:</strong> Mantén el estado del Storage en "Excelente" o "Bueno"</p>
            <p>• <strong>Eliminación segura:</strong> Usa la función de eliminación segura para propiedades futuras</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 