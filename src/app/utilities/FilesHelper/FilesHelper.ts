export const FiletoURL = (file: File) => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const url = reader.result as string;
            resolve(url);
        };
        reader.onerror = () => {
            reject("Error al convertir el archivo a URL");
        };
        reader.readAsDataURL(file);
    });
};
export const FiletoBlob = (file: File) => {
    return new Promise<Blob>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const blob = new Blob([reader.result as ArrayBuffer], { type: file.type });
            resolve(blob);
        };
        reader.onerror = () => {
            reject("Error al convertir el archivo a Blob");
        };
        reader.readAsArrayBuffer(file);
    });
};

export const FiletoBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            resolve(base64);
        };
        reader.onerror = () => {
            reject("Error al convertir el archivo a Base64");
        };
        reader.readAsDataURL(file);
    });
};

export const urlToFile = (url: string, fileName: string, type: string) => {
    return fetch(url)
        .then(res => res.arrayBuffer())
        .then(buffer => new File([buffer], fileName, { type }));
};

export const DownloadFile = (url: string, fileName: string) => {
    return fetch(url)
        .then(res => res.blob())
        .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
        });
};
export const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer el archivo.'));
        reader.readAsDataURL(file);
    });