import { ref, uploadBytes, getDownloadURL, deleteObject, listAll, FirebaseStorage } from "firebase/storage";

import { getCurrentDateTime } from "@/app/utilities/DatesHelper/Dateshelper";
import { FiletoURL, urlToFile } from "@/app/utilities/FilesHelper/FilesHelper";
import { compressImage, getBase64FileSizeInKB } from "@/app/utilities/PicturesHelper/PictureHelper";

export interface FirebaseStorageHelper {
    uploadImage: (file: File, filePath: string, qualitycompressed?: number | undefined) => Promise<string>
    uploadFile: (file: File | Blob, filePath: string, disableTime?: boolean) => Promise<string>;
    updateFile: (file: File, filePath: string) => Promise<string>;
    listFilesAndUrls: (path: string) => Promise<any>;
    downloadFile: (filePath: string) => Promise<string>;
    deleteFile: (filePath: string) => Promise<void>;
    storage: FirebaseStorage | null;
}

const useFirebaseStorageHelper = (storage: FirebaseStorage | null): FirebaseStorageHelper => {
    const buildUploadSuffix = () => {
        const now = new Date();
        const timestamp = `${getCurrentDateTime(now)}:${String(now.getMilliseconds()).padStart(3, "0")}`;
        const uuid =
            typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
                ? crypto.randomUUID()
                : `${Math.random().toString(16).slice(2)}-${Date.now()}`;

        return `-${timestamp}-${uuid}`;
    };

    const buildUniqueStoragePath = (filePath: string, disableTime: boolean = false) => {
        if (disableTime) return filePath;

        const suffix = buildUploadSuffix();
        const extensionIndex = filePath.lastIndexOf(".");
        const slashIndex = filePath.lastIndexOf("/");
        const hasExtension = extensionIndex > slashIndex;

        if (!hasExtension) {
            return `${filePath}${suffix}`;
        }

        const basePath = filePath.slice(0, extensionIndex);
        const extension = filePath.slice(extensionIndex);
        return `${basePath}${suffix}${extension}`;
    };

    const uploadImage = async (file: File, filePath: string, qualitycompressed?: number, disableTime: boolean = false) => {
        const finalPath = buildUniqueStoragePath(filePath, disableTime);
        const fileUrl = await FiletoURL(file);
        const originalSize = await getBase64FileSizeInKB(fileUrl);
        console.log(`TamaÃ±o original: ${originalSize} KB`);
        const imageCompressed = await compressImage(fileUrl, qualitycompressed);
        if (imageCompressed) {
            const sizeInKB = await getBase64FileSizeInKB(imageCompressed);
            console.log(`TamaÃ±o de la imagen: ${sizeInKB} KB`);
            const filecompressedImage = await urlToFile(imageCompressed, file.name, file.type);
            return await uploadFile(filecompressedImage, finalPath, true);
        } else {
            return uploadFile(file, finalPath, true);
        }
    };

    const uploadFile = async (file: File | Blob, filePath: string, disableTime: boolean = false) => {
        if (!storage) throw "Firebase no configurado correctamente";
        const finalPath = buildUniqueStoragePath(filePath, disableTime);
        const storageRef = ref(storage, finalPath);
        const snapshot = await uploadBytes(storageRef, file);
        console.log("snapshot", snapshot);
        return await getDownloadURL(snapshot.ref);
    };

    // FunciÃ³n para descargar un archivo
    const downloadFile = async (filePath: string) => {
        if (!storage) throw "Firebase no configurado correctamente";
        const storageRef = ref(storage, filePath);
        return await getDownloadURL(storageRef);
    };

    // FunciÃ³n para eliminar un archivo
    const deleteFile = async (filePath: string) => {
        if (!storage) throw "Firebase no configurado correctamente";
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);
    };

    // Ejemplo de actualizaciÃ³n de archivo (sube el nuevo archivo con el mismo nombre, lo que sobrescribe el anterior)
    const updateFile = async (file: any, filePath: string) => {
        await deleteFile(filePath); // Primero elimina el archivo existente
        return await uploadFile(file, filePath); // Luego sube el nuevo archivo
    };

    const listFilesAndUrls = async (path: string) => {
        if (!storage) throw "Firebase no configurado correctamente";
        const listRef = ref(storage, path);
        const res = await listAll(listRef);
        const urls = await Promise.all(
            res.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                return { name: itemRef.name, url };
            })
        );
        return urls; // Array de objetos {name, url}
    };

    return {
        storage,
        uploadFile,
        updateFile,
        listFilesAndUrls,
        downloadFile,
        deleteFile,
        uploadImage
    }
}

export default useFirebaseStorageHelper
