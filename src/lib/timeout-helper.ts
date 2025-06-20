// Utilidad para agregar timeout a promesas que pueden colgarse
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 30000, // 30 segundos por defecto
  errorMessage: string = 'La operación tardó demasiado tiempo'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error(errorMessage));
      }, timeoutMs);
    })
  ]);
}

// Utilidad específica para operaciones de Supabase
export function withSupabaseTimeout<T>(
  promise: Promise<T>,
  operation: string = 'operación'
): Promise<T> {
  return withTimeout(
    promise,
    15000, // 15 segundos para operaciones de DB
    `La ${operation} tardó demasiado tiempo. Verifica tu conexión o intenta nuevamente.`
  );
} 