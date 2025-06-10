'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';

// Tipo para representar una imagen que puede ser un archivo local o una URL existente
export interface ImageItem {
  id: string;
  type: 'file' | 'url';
  file?: File;
  url?: string;
  preview: string; // URL de preview (blob para archivos, URL directa para URLs existentes)
}

interface ImageUploaderDeferredProps {
  value: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUploaderDeferred({ 
  value, 
  onChange, 
  maxImages = 10,
  disabled = false 
}: ImageUploaderDeferredProps) {
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Limpiar URLs de objeto cuando el componente se desmonta
  useEffect(() => {
    return () => {
      value.forEach(item => {
        if (item.type === 'file' && item.preview.startsWith('blob:')) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError('');

    // Verificar límite de imágenes
    if (value.length + files.length > maxImages) {
      setError(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    // Validar archivos
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name}: No es una imagen válida`);
      } else if (file.size > 5 * 1024 * 1024) { // 5MB máximo
        errors.push(`${file.name}: Archivo muy grande (máximo 5MB)`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setError(errors.join(', '));
    }

    if (validFiles.length === 0) return;

    // Crear ImageItems para los archivos válidos
    const newImageItems: ImageItem[] = validFiles.map(file => ({
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'file',
      file,
      preview: URL.createObjectURL(file)
    }));

    onChange([...value, ...newImageItems]);

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (idToRemove: string) => {
    const imageToRemove = value.find(item => item.id === idToRemove);
    
    // Limpiar URL de objeto si es un archivo local
    if (imageToRemove?.type === 'file' && imageToRemove.preview.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    const newImages = value.filter(item => item.id !== idToRemove);
    onChange(newImages);
  };

  const fileImages = value.filter(item => item.type === 'file');
  const urlImages = value.filter(item => item.type === 'url');

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || value.length >= maxImages}
          className="bg-white hover:bg-gray-50"
        >
          <Upload className="h-4 w-4 mr-2" />
          {value.length === 0 ? 'Seleccionar Imágenes' : 'Agregar Más'}
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <span className="text-sm text-gray-500">
          {value.length} / {maxImages}
        </span>
      </div>

      {fileImages.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Imágenes seleccionadas ({fileImages.length})
            </span>
          </div>
          <p className="text-xs text-blue-600">
            Estas imágenes se subirán cuando guardes la propiedad
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-2">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {value.map((imageItem) => (
            <div key={imageItem.id} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={imageItem.preview}
                  alt={`Imagen ${imageItem.id}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    
                    // Mostrar icono de error
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'w-full h-full flex items-center justify-center bg-gray-200';
                    errorDiv.innerHTML = '<span class="text-xs text-gray-500">Error al cargar</span>';
                    target.parentNode?.appendChild(errorDiv);
                  }}
                />
                
                {/* Indicador de tipo */}
                <div className="absolute top-1 left-1">
                  {imageItem.type === 'file' ? (
                    <div className="bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                      Nuevo
                    </div>
                  ) : (
                    <div className="bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                      Guardado
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(imageItem.id)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {value.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">No hay imágenes seleccionadas</p>
          <p className="text-xs text-gray-400 mt-1">
            Las imágenes se subirán al Storage cuando guardes la propiedad
          </p>
        </div>
      )}
    </div>
  );
}

// Funciones de utilidad para convertir entre formatos
export function urlStringToImageItems(urlString: string): ImageItem[] {
  if (!urlString) return [];
  
  return urlString
    .split(',')
    .map(url => url.trim())
    .filter(url => url)
    .map(url => ({
      id: `url_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'url' as const,
      url,
      preview: url
    }));
}

export function imageItemsToUrlString(imageItems: ImageItem[]): string {
  return imageItems
    .filter(item => item.type === 'url' && item.url)
    .map(item => item.url!)
    .join(', ');
}

export function getFilesToUpload(imageItems: ImageItem[]): File[] {
  return imageItems
    .filter(item => item.type === 'file' && item.file)
    .map(item => item.file!);
} 