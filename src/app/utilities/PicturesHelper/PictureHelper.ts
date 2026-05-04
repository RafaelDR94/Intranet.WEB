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

export const getDataUrlMimeType = (dataUrl: string): string => {
  const header = dataUrl.split(',')[0] || '';
  const match = header.match(/data:([^;]+)/);
  return match ? match[1] : 'image/jpeg';
};

export const isHeicLikeMimeType = (mimeType?: string) => {
  const normalized = (mimeType ?? '').toLowerCase();
  return normalized === 'image/heic' || normalized === 'image/heif';
};

const blobToArrayBuffer = async (blob: Blob): Promise<ArrayBuffer> => {
  if (typeof blob.arrayBuffer === 'function') {
    return blob.arrayBuffer();
  }

  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error ?? new Error('Unable to read blob'));
    reader.readAsArrayBuffer(blob);
  });
};

export const detectImageMimeTypeFromSignature = async (
  blob: Blob
): Promise<string | undefined> => {
  const buffer = await blobToArrayBuffer(blob);
  const bytes = new Uint8Array(buffer.slice(0, 32));

  if (
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return 'image/jpeg';
  }

  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return 'image/png';
  }

  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'image/webp';
  }

  const brand = String.fromCharCode(...Array.from(bytes.slice(4, 12))).toLowerCase();
  if (brand.includes('ftypheic') || brand.includes('ftypheif') || brand.includes('ftypmif1')) {
    return 'image/heic';
  }

  return undefined;
};

export const convertHeicBlobToJpeg = async (blob: Blob): Promise<Blob> => {
  const { default: heic2any } = await import('heic2any');
  const result = await heic2any({
    blob,
    toType: 'image/jpeg',
    quality: 0.9,
  });

  const first = Array.isArray(result) ? result[0] : result;
  if (!(first instanceof Blob)) {
    throw new Error('HEIC conversion did not return a Blob');
  }

  return first.type ? first : new Blob([first], { type: 'image/jpeg' });
};

export const normalizeImageBlobForBrowser = async (
  blob: Blob,
  mimeHint?: string
): Promise<Blob> => {
  const detectedMime = await detectImageMimeTypeFromSignature(blob);
  const resolvedMime = detectedMime || blob.type || mimeHint || '';

  if (isHeicLikeMimeType(resolvedMime)) {
    return convertHeicBlobToJpeg(blob);
  }

  if (!blob.type && detectedMime) {
    return new Blob([blob], { type: detectedMime });
  }

  return blob;
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
  const sourceMime = getDataUrlMimeType(dataUrl);

  if (isHeicLikeMimeType(sourceMime)) {
    const convertedBlob = await convertHeicBlobToJpeg(base64ToBlob(dataUrl));
    return {
      blob: convertedBlob,
      mime: convertedBlob.type || 'image/jpeg',
      width: 0,
      height: 0,
    };
  }

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
