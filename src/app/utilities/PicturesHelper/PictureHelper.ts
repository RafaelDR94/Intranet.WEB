/** Convierte un dataURL en un `Blob`. */
export const base64ToBlob = (base64: string) => {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
};

const getDataUrlMimeType = (dataUrl: string): string => {
  const header = dataUrl.split(',')[0] || '';
  const match = header.match(/data:([^;]+)/);
  return match ? match[1] : 'image/jpeg';
};

const isWebpSupported = (() => {
  let cached: boolean | null = null;
  return () => {
    if (cached !== null) return cached;
    if (typeof document === 'undefined') {
      cached = false;
      return cached;
    }
    const canvas = document.createElement('canvas');
    const dataUrl = canvas.toDataURL('image/webp');
    cached = dataUrl.startsWith('data:image/webp');
    return cached;
  };
})();

const loadImageFromDataUrl = (dataUrl: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = dataUrl;
  });

const calculateTargetSize = (
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
) => {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }
  const widthRatio = maxWidth / width;
  const heightRatio = maxHeight / height;
  const ratio = Math.min(widthRatio, heightRatio);
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
};

export type OptimizeImageOptions = {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  preferWebp?: boolean;
  /**
   * Cuando se requiere conservar transparencia (por ejemplo firmas),
   * evita convertir a JPEG en navegadores sin soporte WebP y usa PNG como fallback.
   */
  preserveAlpha?: boolean;
};

export type OptimizedImageResult = {
  blob: Blob;
  mime: string;
  width: number;
  height: number;
};

/** Redimensiona y recomprime un dataURL para reducir peso. */
export const optimizeDataUrlToBlob = async (
  dataUrl: string,
  options: OptimizeImageOptions = {}
): Promise<OptimizedImageResult> => {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.72,
    preferWebp = true,
    preserveAlpha = false,
  } = options;

  if (typeof document === 'undefined') {
    const fallbackBlob = base64ToBlob(dataUrl);
    return {
      blob: fallbackBlob,
      mime: fallbackBlob.type || getDataUrlMimeType(dataUrl),
      width: 0,
      height: 0,
    };
  }

  const img = await loadImageFromDataUrl(dataUrl);
  const target = calculateTargetSize(img.width, img.height, maxWidth, maxHeight);
  const canvas = document.createElement('canvas');
  canvas.width = target.width;
  canvas.height = target.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const fallbackBlob = base64ToBlob(dataUrl);
    return {
      blob: fallbackBlob,
      mime: fallbackBlob.type || getDataUrlMimeType(dataUrl),
      width: target.width,
      height: target.height,
    };
  }

  ctx.drawImage(img, 0, 0, target.width, target.height);

  const useWebp = preferWebp && isWebpSupported();
  const mime = preserveAlpha
    ? (useWebp ? 'image/webp' : 'image/png')
    : (useWebp ? 'image/webp' : 'image/jpeg');

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error('toBlob failed'))),
      mime,
      mime === 'image/png' ? undefined : quality
    );
  });

  return { blob, mime, width: target.width, height: target.height };
};

/** Comprime una imagen remota y devuelve un dataURL. */
export const compressImage = (imageUrl: string, quality: number = 0.5): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // En caso de imágenes de origen distinto, es posible que necesites habilitar CORS:
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        // El segundo parámetro de toDataURL define la calidad (entre 0 y 1)
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      } else {
        reject(new Error("No se pudo obtener el contexto del canvas"));
      }
    };
    img.onerror = (err) => reject(err);
    img.src = imageUrl;
  });
};

/** Obtiene el tamaño en KB de un dataURL. */
export const getBase64FileSizeInKB = (dataUrl: string): number => {
  // Se remueve la parte de encabezado que indica el tipo de imagen y la codificación
  const base64Str = dataUrl.split(',')[1];
  // Se calcula la cantidad de relleno (padding) que se pueda tener al final (generalmente "=" o "==")
  const padding = (base64Str.match(/=+$/) || [""])[0].length;
  // El tamaño en bytes se obtiene de la fórmula: (largo * 3/4) - padding
  const sizeInBytes = (base64Str.length * 3 / 4) - padding;
  return sizeInBytes / 1024; // Convertir a kilobytes
};

/** Descarga una imagen y la devuelve en base64. */
export const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Accept': 'image/*'
      }
    });
    
    if (!response.ok) {
      console.log("Error al obtener la imagen: ", response);
      return "";
    }


    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error al convertir URL a base64:', error);
   return "";
  }
};
