import { ref, uploadBytes, getDownloadURL, deleteObject, listAll, FirebaseStorage } from "firebase/storage";


export interface FirebaseStorageHelper {
    uploadFile: (file: any, filePath: string) => Promise<string>;
    updateFile: (file: File, filePath: string) => Promise<string>;
    listFilesAndUrls: (path: string) => Promise<any>;
    downloadFile: (filePath: string) => Promise<string>;
    deleteFile: (filePath: string) => Promise<void>;
    storage: FirebaseStorage | null;
}

const useFirebaseStorageHelper = (storage: FirebaseStorage | null):FirebaseStorageHelper => {

    const uploadFile = async (file: any, filePath: string) => {
        try {
            if (storage) {
                const storageRef = ref(storage, filePath);
                const snapshot = await uploadBytes(storageRef, file);
                return await getDownloadURL(snapshot.ref);
            }
            throw "Firebase no configurado correctamente";
        } catch (error) {

            throw error;
        }
    };

    // Función para descargar un archivo
    const downloadFile = async (filePath: string) => {
        try {
            if (storage) {
                const storageRef = ref(storage, filePath);
                return await getDownloadURL(storageRef);
            }
            throw "Firebase no configurado correctamente";
        } catch (error) {

            throw error;
        }
    };

    // Función para eliminar un archivo
    const deleteFile = async (filePath: string) => {
        try {
            if (storage) {
                const storageRef = ref(storage, filePath);
                await deleteObject(storageRef);
            }
            throw "Firebase no configurado correctamente";
        } catch (error) {
            throw error;
        }
    };

    // Ejemplo de actualización de archivo (sube el nuevo archivo con el mismo nombre, lo que sobrescribe el anterior)
    const updateFile = async (file: any, filePath: string) => {
        try {
            await deleteFile(filePath); // Primero elimina el archivo existente
            return await uploadFile(file, filePath); // Luego sube el nuevo archivo
        } catch (error) {
            console.error("Error al actualizar el archivo:", error);
            throw error;
        }
    };

    const listFilesAndUrls = async (path: string) => {
        try {
            if (storage) {
                const listRef = ref(storage, path);
                const res = await listAll(listRef);
                const urls = await Promise.all(
                    res.items.map(async (itemRef) => {
                        const url = await getDownloadURL(itemRef);
                        return { name: itemRef.name, url };
                    })
                );
                return urls; // Array de objetos {name, url}
            }

        } catch (error) {
            console.error("Error al listar los archivos:", error);
            throw error;
        }
    };

    return {
        storage,
        uploadFile,
        updateFile,
        listFilesAndUrls,
        downloadFile,
        deleteFile
    }
}
export default useFirebaseStorageHelper