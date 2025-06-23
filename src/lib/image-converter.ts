/**
 * Utilidades para convertir imágenes a formato WebP para optimización
 */

interface ConversionOptions {
  quality?: number; // 0.1 a 1.0 (default: 0.8)
  maxWidth?: number; // Ancho máximo en pixels (default: 1920)
  maxHeight?: number; // Alto máximo en pixels (default: 1080)
}

/**
 * Convierte un archivo de imagen a formato WebP
 */
export async function convertImageToWebP(
  file: File, 
  options: ConversionOptions = {}
): Promise<{ success: boolean; file?: File; error?: string }> {
  try {
    const { quality = 0.8, maxWidth = 1920, maxHeight = 1080 } = options;

    console.log(`🔄 Iniciando conversión a WebP: ${file.name}`);

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'El archivo debe ser una imagen' };
    }

    // Si ya es WebP, solo redimensionar si es necesario
    if (file.type === 'image/webp') {
      console.log('✅ El archivo ya está en formato WebP');
      return await resizeIfNeeded(file, maxWidth, maxHeight, quality);
    }

    // Crear un canvas para la conversión
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return { success: false, error: 'No se puede crear el contexto del canvas' };
    }

    // Cargar la imagen
    const img = new Image();
    const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Error al cargar la imagen'));
      img.src = URL.createObjectURL(file);
    });

    const loadedImg = await imageLoadPromise;

    // Calcular dimensiones manteniendo la proporción
    const { width, height } = calculateDimensions(
      loadedImg.width, 
      loadedImg.height, 
      maxWidth, 
      maxHeight
    );

    // Configurar el canvas
    canvas.width = width;
    canvas.height = height;

    // Dibujar la imagen redimensionada
    ctx.drawImage(loadedImg, 0, 0, width, height);

    // Limpiar la URL del objeto
    URL.revokeObjectURL(img.src);

    // Convertir a WebP
    const webpBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/webp', quality);
    });

    if (!webpBlob) {
      return { success: false, error: 'Error al convertir la imagen a WebP' };
    }

    // Crear el nuevo archivo
    const originalName = file.name.split('.').slice(0, -1).join('.');
    const webpFile = new File([webpBlob], `${originalName}.webp`, {
      type: 'image/webp',
      lastModified: Date.now()
    });

    const originalSizeMB = (file.size / 1024 / 1024).toFixed(2);
    const newSizeMB = (webpFile.size / 1024 / 1024).toFixed(2);
    const reduction = ((file.size - webpFile.size) / file.size * 100).toFixed(1);

    console.log(`✅ Conversión exitosa: ${originalSizeMB}MB → ${newSizeMB}MB (${reduction}% reducción)`);

    return { success: true, file: webpFile };

  } catch (error) {
    console.error('❌ Error en conversión a WebP:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido en la conversión' 
    };
  }
}

/**
 * Redimensiona una imagen WebP si supera las dimensiones máximas
 */
async function resizeIfNeeded(
  file: File, 
  maxWidth: number, 
  maxHeight: number, 
  quality: number
): Promise<{ success: boolean; file?: File; error?: string }> {
  try {
    const img = new Image();
    const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Error al cargar la imagen WebP'));
      img.src = URL.createObjectURL(file);
    });

    const loadedImg = await imageLoadPromise;
    
    // Verificar si necesita redimensionamiento
    if (loadedImg.width <= maxWidth && loadedImg.height <= maxHeight) {
      URL.revokeObjectURL(img.src);
      console.log('✅ La imagen WebP ya tiene dimensiones apropiadas');
      return { success: true, file };
    }

    // Redimensionar
    const { width, height } = calculateDimensions(
      loadedImg.width, 
      loadedImg.height, 
      maxWidth, 
      maxHeight
    );

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return { success: false, error: 'No se puede crear el contexto del canvas' };
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(loadedImg, 0, 0, width, height);

    URL.revokeObjectURL(img.src);

    const resizedBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/webp', quality);
    });

    if (!resizedBlob) {
      return { success: false, error: 'Error al redimensionar la imagen WebP' };
    }

    const resizedFile = new File([resizedBlob], file.name, {
      type: 'image/webp',
      lastModified: Date.now()
    });

    console.log(`✅ Imagen WebP redimensionada: ${loadedImg.width}x${loadedImg.height} → ${width}x${height}`);

    return { success: true, file: resizedFile };

  } catch (error) {
    console.error('❌ Error al redimensionar imagen WebP:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido en el redimensionamiento' 
    };
  }
}

/**
 * Calcula las nuevas dimensiones manteniendo la proporción
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let { width, height } = { width: originalWidth, height: originalHeight };

  // Redimensionar si excede el ancho máximo
  if (width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }

  // Redimensionar si excede el alto máximo
  if (height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }

  return { 
    width: Math.round(width), 
    height: Math.round(height) 
  };
}

/**
 * Convierte múltiples archivos a WebP en paralelo
 */
export async function convertMultipleImagesToWebP(
  files: File[],
  options: ConversionOptions = {}
): Promise<{
  success: boolean;
  convertedFiles: File[];
  errors: string[];
}> {
  console.log(`🔄 Iniciando conversión de ${files.length} imágenes a WebP...`);

  const results = await Promise.all(
    files.map(file => convertImageToWebP(file, options))
  );

  const convertedFiles: File[] = [];
  const errors: string[] = [];

  results.forEach((result, index) => {
    if (result.success && result.file) {
      convertedFiles.push(result.file);
    } else {
      errors.push(`${files[index].name}: ${result.error}`);
    }
  });

  console.log(`✅ Conversión completada: ${convertedFiles.length}/${files.length} exitosas`);

  return {
    success: convertedFiles.length > 0,
    convertedFiles,
    errors
  };
} 