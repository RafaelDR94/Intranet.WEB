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

export const getBase64FileSizeInKB = (dataUrl: string): number => {
  // Se remueve la parte de encabezado que indica el tipo de imagen y la codificación
  const base64Str = dataUrl.split(',')[1];
  // Se calcula la cantidad de relleno (padding) que se pueda tener al final (generalmente "=" o "==")
  const padding = (base64Str.match(/=+$/) || [""])[0].length;
  // El tamaño en bytes se obtiene de la fórmula: (largo * 3/4) - padding
  const sizeInBytes = (base64Str.length * 3 / 4) - padding;
  return sizeInBytes / 1024; // Convertir a kilobytes
};

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