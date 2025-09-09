import { 
    ref, 
    set, 
    get, 
    update, 
    remove, 
    push, 
    Database ,
    onValue
  } from "firebase/database";
  
  export interface FirebaseRealtimeHelper {
    /**
     * Establece los datos en la ruta especificada.
     */
    setData: (path: string, data: any) => Promise<void>;
    /**
     * Obtiene los datos de la ruta especificada.
     */
    getData: (path: string) => Promise<any>;
    /**
     * Actualiza los datos en la ruta especificada.
     */
    updateData: (path: string, data: any) => Promise<void>;
    /**
     * Elimina los datos en la ruta especificada.
     */
    deleteData: (path: string) => Promise<void>;
    /**
     * Inserta (hace push) nuevos datos en la ruta especificada y retorna la clave generada.
     */
    pushData: (path: string, data: any) => Promise<string | null>;
    subscribe: (path: string, callback: (data: any) => void) => (() => void);
  }
  
  const useFirebaseRealtimeHelper = (database: Database | null): FirebaseRealtimeHelper => {
    const setData = async (path: string, data: any) => {
      if (!database) throw "Firebase Realtime Database no configurado correctamente";
      const dataRef = ref(database, path);
      await set(dataRef, data);
    };
  
    const getData = async (path: string) => {
      if (!database) throw "Firebase Realtime Database no configurado correctamente";
      const dataRef = ref(database, path);
      const snapshot = await get(dataRef);
      return snapshot.exists() ? snapshot.val() : null;
    };
  
    const updateData = async (path: string, data: any) => {
      if (!database) throw "Firebase Realtime Database no configurado correctamente";
      const dataRef = ref(database, path);
      await update(dataRef, data);
    };
  
    const deleteData = async (path: string) => {
      if (!database) throw "Firebase Realtime Database no configurado correctamente";
      const dataRef = ref(database, path);
      await remove(dataRef);
    };
  
    const pushData = async (path: string, data: any) => {
      if (!database) throw "Firebase Realtime Database no configurado correctamente";
      const dataRef = ref(database, path);
      const newRef = push(dataRef);
      await set(newRef, data);
      return newRef.key;
    };

    const subscribe = (
      path: string,
      callback: (data: any) => void
    ): (() => void) => {
      if (!database) throw "Firebase Realtime Database no configurado";
      const dataRef = ref(database, path);
      // onValue devuelve la función para desuscribirse
      const unsubscribe = onValue(dataRef, (snapshot) => {
        callback(snapshot.exists() ? snapshot.val() : null);
      });
      return unsubscribe;
    };
  
    return {
      setData,
      getData,
      updateData,
      deleteData,
      pushData,
      subscribe
    };
  };
  
  export default useFirebaseRealtimeHelper;
  
