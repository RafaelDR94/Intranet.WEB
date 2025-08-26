import { Messaging, getToken, onMessage } from 'firebase/messaging';
import { useEffect ,useState} from 'react';

export interface FirebaseMessagingHelper {
  /** Obtiene el token de Firebase Messaging. */
  getMessagingToken: () => Promise<string>;
  /** Escucha mensajes en foreground. */
  onMessageReceived: (callback: (payload: any) => void) => void;
  notification: any;
}

const useFirebaseMessagingHelper = (messaging: Messaging | null): FirebaseMessagingHelper => {
  const [notification, setNotification] = useState<any>(null);  
  const vapidKey = "BJ33ZXyzfTmjYLTuwqqoq635jUZMWIM09-bBFWpfHiDfZ3-DONOJ_Q0oYH8yTP164dBpE5LWDsqZSt-zkZAEqPU";
  
  const getMessagingToken = async () => {

    if (!messaging) {
      console.warn("Objeto messaging no configurado");
      throw new Error("Firebase Messaging no configurado correctamente");
    }

    try {

      const registration = await navigator.serviceWorker.ready;
      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      });

      if (!token) {
        throw new Error("No se pudo obtener el token de Firebase Messaging.");
      }

      console.log("Token de Firebase Messaging obtenido:", token);
      return token;
    } catch (error) {
      console.error("Error al obtener el token de Firebase Messaging:", error);
      throw error;
    }
  };

  const onMessageReceived = (callback: (payload: any) => void) => {
    if (!messaging) {
      throw new Error("Firebase Messaging no configurado correctamente");
    }

    onMessage(messaging, callback);
  };

 

  useEffect(() => {
    if (!messaging) {
      console.warn("Firebase Messaging no está configurado");
      return;
    }
    onMessageReceived((payload) => {
      setNotification(payload);
      console.log("Mensaje recibido en foreground:", payload);
    });
  }, [messaging]);  

  return {
    notification,
    getMessagingToken,
    onMessageReceived,
  };
};

export default useFirebaseMessagingHelper;
