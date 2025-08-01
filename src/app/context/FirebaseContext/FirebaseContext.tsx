'use client'
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getStorage, FirebaseStorage } from "firebase/storage";
import { Messaging, getMessaging } from "firebase/messaging";
import { getDatabase, Database } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, Auth, onAuthStateChanged, User } from "firebase/auth";
import { AuthFirebaseConfiguration } from "@/app/configurations/Axios/urls";
import { useAuth } from "../AuthContext/AuthContext";
import useFirebaseStorageHelper, { FirebaseStorageHelper } from "./hooks/useFirebaseStorageHelper";
import useFirebaseRealtimeHelper, { FirebaseRealtimeHelper } from "./hooks/useFirebaseRealTimeHelpet";
import useFirebaseMessagingHelper, { FirebaseMessagingHelper } from "./hooks/useFirebaseMessaginHelper";
import { usePermissionsListener } from "./hooks/usePermissionsListener";
import useAxios from "../../hooks/useIntranetCRUD";
import Uselogs from "./hooks/uselogs";
import { getDeviceId, saveFirebaseToken, readFirebaseToken } from "../AuthContext/utilities/AuthService";


export interface UseFirebasereturn {
  firebasestorage: FirebaseStorageHelper,
  firebaserealtime: FirebaseRealtimeHelper;
  firebaseMessaging: FirebaseMessagingHelper;
  permissionsChanged: { state: boolean; newPermissions: string; }
  firebaseLogginFail: boolean
}

export const FirebaseContext = createContext<UseFirebasereturn | undefined>(undefined);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {

  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [storage, setStorage] = useState<FirebaseStorage | null>(null);
  const [database, setDatabase] = useState<Database | null>(null);
  const [messaging, setMessaging] = useState<Messaging | null>(null);
  const [firebaseLogginFail, setFirebaseLogginFail] = useState(false);
  const [firebaseConfiguration, setFirebaseConfiguration] = useState<any | null>(null);
  const firebasestorage = useFirebaseStorageHelper(storage);
  const firebaserealtime = useFirebaseRealtimeHelper(database);
  const firebaseMessaging = useFirebaseMessagingHelper(messaging);
  const { user, setHasExpired, offlineMode, updateUserPermissions } = useAuth();

  const { IntranetGet } = useAxios();
  const permissionsChanged = usePermissionsListener(database, user?.idUser || "");
  useEffect(() => {
    if (permissionsChanged.state) {
      console.log("Los permisos han cambiado",permissionsChanged);

      updateUserPermissions(permissionsChanged.newPermissions);
    }
  }, [permissionsChanged]);

  useEffect(() => {
    if (!auth || !user?.idUser || !firebaserealtime || !firebaseMessaging) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      const deviceId = await getDeviceId();
      console.log("deviceId", deviceId);
      if (firebaseUser) {
        console.log("✅ Usuario autenticado en Firebase:", firebaseUser.email);

        try {
          const existingToken = await readFirebaseToken();
          console.log("🔍 Token existente:", existingToken);
          if (!existingToken) {

            if (Notification.permission !== "granted") {
              console.log("🔔 Solicitando permiso para notificaciones...");
              const permission = await Notification.requestPermission();
              if (permission !== "granted") {
                console.warn("Permiso de notificaciones denegado");
              } else {
                const token = await firebaseMessaging.getMessagingToken();
                saveFirebaseToken(token);
                await firebaserealtime.setData(`Notifications/${user.idUser}/` + deviceId, token);
                console.log("🔐 Token de Firebase Messaging guardado:", token);
              }
            } else {
              const token = await firebaseMessaging.getMessagingToken();
              saveFirebaseToken(token);
              await firebaserealtime.setData(`Notifications/${user.idUser}/` + deviceId, token);
              console.log("🔐 Token de Firebase Messaging guardado:", token);
            }
          }
        } catch (err) {
          console.error("❌ Error manejando el token de notificación:", err);
        }
      }
    });

    return () => unsubscribe(); // cleanup
  }, [auth, user?.idUser, firebaserealtime, firebaseMessaging]);

  Uselogs({ firebaserealtime, database, user, setHasExpired, offlineMode })



  const authenticateWithEmailAndPassword = async (email: string, password: string) => {
    if (auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);

      } catch (error) {
        setFirebaseLogginFail(true);
        console.error("Error al autenticar con email y contraseña:", error);
        throw error;
      }
    }
  };


  const GetFirebaseConfigurations = async (attempt = 1) => {
    if (user?.token && !firebaseConfiguration && !offlineMode) {

      const onFirebaseConfigResponse = (response: any) => {
        if (response instanceof Error) {
          console.error("Error fetching firebase config:", response);
          setHasExpired(true);
          return;
        }
        if (response.status === 200) {
          const Configurations = response.data.data;
          setFirebaseConfiguration(Configurations);
          return;
        }
        if (response.status === 401) {
          setHasExpired(true);
          return;
        }
        if (attempt >= 10) {
          setHasExpired(true);
          return;
        }
        setTimeout(() => {
          GetFirebaseConfigurations(attempt + 1);
        }, 1000);

      }
      IntranetGet(AuthFirebaseConfiguration, onFirebaseConfigResponse)
    }
  }

  useEffect(() => {
    setTimeout(GetFirebaseConfigurations, 1000)
  }, [user?.token, firebaseConfiguration, offlineMode]);

  useEffect(() => {
    if (firebaseConfiguration) {
      setApp(initializeApp(firebaseConfiguration.firebaseConfig));
    }
  }, [firebaseConfiguration])

  useEffect(() => {
    if (app) {
      setAuth(getAuth(app));
      setStorage(getStorage(app));
      setDatabase(getDatabase(app));
      setMessaging(getMessaging(app));

    }
  }, [app])

  useEffect(() => {
    if (auth && user?.userName) {
      // authenticateWithEmailAndPassword(user?.userName, atob(firebaseConfiguration.paswordFirebase));
      authenticateWithEmailAndPassword(user?.userName, "Dr123qwe");
    }
  }, [auth, user])

  return (

    <FirebaseContext.Provider
      value={{
        firebaseLogginFail,
        firebasestorage,
        firebaserealtime,
        permissionsChanged,
        firebaseMessaging,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );


};

export const useFirebase = () => {
  const context = React.useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("ConfigurationsProvider must be used within an AuthProvider");
  }
  return context;
};
