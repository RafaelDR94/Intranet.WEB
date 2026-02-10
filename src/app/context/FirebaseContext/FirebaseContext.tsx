"use client";
import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  Auth,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { getDatabase, Database } from "firebase/database";
import { Messaging, getMessaging } from "firebase/messaging";
import { getStorage, FirebaseStorage } from "firebase/storage";
import React, { createContext, useState, ReactNode, useEffect, useCallback, useRef } from "react";


import useAxios from "../../hooks/useIntranetCRUD/useIntranetCRUD";
import { useAuth } from "../AuthContext/AuthContext";
import {
  getDeviceId,
  // saveFirebaseToken,
  // readFirebaseToken,
} from "../AuthContext/utilities/AuthService";

import useFirebaseMessagingHelper from "./hooks/useFirebaseMessaginHelper";
import useFirebaseRealtimeHelper from "./hooks/useFirebaseRealTimeHelpet";
import useFirebaseStorageHelper from "./hooks/useFirebaseStorageHelper";
import Uselogs from "./hooks/uselogs";
import { usePermissionsListener } from "./hooks/usePermissionsListener";
import { UseFirebasereturn } from "./types";

// import { AuthFirebaseConfiguration } from "@/app/configurations/Axios/urls";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";

export const FirebaseContext = createContext<UseFirebasereturn | undefined>(
  undefined
);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const hasFirebaseauth = useRef(false);
  const hasRegisteredToken = useRef(false);
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
  const { user, setHasExpired, offlineMode } = useAuth();

  const { IntranetGet } = useAxios();
  const permissionsChanged = usePermissionsListener(
    database,
    user?.idUser || ""
  );
  const state = useAuthStore()
  useEffect(() => {
    if (permissionsChanged.state) {
      state.updateUserPermissions(permissionsChanged.newPermissions);
    }
  }, [permissionsChanged, state]);

  useEffect(() => {
    if (hasRegisteredToken.current) return;
    if (!auth || !user?.idUser || !firebaserealtime || !firebaseMessaging)
      return;

    hasRegisteredToken.current = true;
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: User | null) => {
        const deviceId = await getDeviceId();
        if (firebaseUser) {
          try {
            // const existingToken = await readFirebaseToken();
            // console.log("Existing Token", existingToken);
            // if (!existingToken) {
              if (Notification.permission !== "granted") {
                const permission = await Notification.requestPermission();
                if (permission !== "granted") {

                  console.warn("Permiso de notificaciones denegado");
                } else {
                  console.log("Generando token");

                  const token = await firebaseMessaging.getMessagingToken();
                  // console.log("Token generado:", token);
                  // saveFirebaseToken(token);
                  await firebaserealtime.setData(
                    `Notifications/${user.idUser}/` + deviceId,
                    token
                  );
                }
              } else {
                const token = await firebaseMessaging.getMessagingToken();
                // console.log("Token generado:", token);
                // saveFirebaseToken(token);
                await firebaserealtime.setData(
                  `Notifications/${user.idUser}/` + deviceId,
                  token
                );
              }
            //}
          } catch (err) {
            console.error("❌ Error manejando el token de notificación:", err);
          }
        }
      }
    );

    return () => unsubscribe(); // cleanup
  }, [auth, user?.idUser, firebaserealtime, firebaseMessaging]);

  Uselogs({ firebaserealtime, database, user, setHasExpired, offlineMode });

  const authenticateWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
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

  // Stable callbacks to satisfy exhaustive-deps
  const authenticateWithEmailAndPasswordCb = useCallback(
    authenticateWithEmailAndPassword,
    [auth]
  );

  const GetFirebaseConfigurations = async (attempt = 1) => {

    if (attempt) {
      setTimeout(() => {
        const firebaseConfig = {
          apiKey: "AIzaSyBtlZct5NCo1_a6pxywUnuzESfj69HEQtY",
          authDomain: "intranetdr-50f9e.firebaseapp.com",
          databaseURL: "https://intranetdr-50f9e-default-rtdb.firebaseio.com",
          projectId: "intranetdr-50f9e",
          storageBucket: "intranetdr-50f9e.appspot.com",
          messagingSenderId: "1069765395792",
          appId: "1:1069765395792:web:503f82a1ee32c02f7c9855",
          measurementId: "G-SMY838399L"
        };

        setFirebaseConfiguration({ firebaseConfig });
      }, 2000)

    }


    // if (user?.token && !firebaseConfiguration && !offlineMode) {
    //   const onFirebaseConfigResponse = (response: any) => {
    //     if (response instanceof Error) {
    //       console.error("Error fetching firebase config:", response);
    //       setHasExpired(true);
    //       return;
    //     }
    //     if (response.status === 200) {
    //       const Configurations = response.data.data;
    //       setFirebaseConfiguration(Configurations);
    //       return;
    //     }
    //     if (response.status === 401) {
    //       setHasExpired(true);
    //       return;
    //     }
    //     if (attempt >= 10) {
    //       setHasExpired(true);
    //       return;
    //     }
    //     setTimeout(() => {
    //       GetFirebaseConfigurations(attempt + 1);
    //     }, 1000);
    //   };
    //   IntranetGet(AuthFirebaseConfiguration, onFirebaseConfigResponse);
    // }
  };


  const GetFirebaseConfigurationsCb = useCallback(
    GetFirebaseConfigurations,
    [GetFirebaseConfigurations, IntranetGet, user?.token, firebaseConfiguration, offlineMode, setHasExpired]
  );

  useEffect(() => {
    setTimeout(GetFirebaseConfigurationsCb, 1000);
  }, [user?.token, firebaseConfiguration, offlineMode, GetFirebaseConfigurationsCb]);

  useEffect(() => {
    if (firebaseConfiguration) {
      setApp(initializeApp(firebaseConfiguration.firebaseConfig));
    }
  }, [firebaseConfiguration]);

  useEffect(() => {
    if (app) {
      setAuth(getAuth(app));
      setStorage(getStorage(app));
      setDatabase(getDatabase(app));
      setMessaging(getMessaging(app));
    }
  }, [app]);

  useEffect(() => {
    if (auth && user?.userName && !hasFirebaseauth.current) {
      console.log(user?.userName);

      // authenticateWithEmailAndPassword(user?.userName, atob(firebaseConfiguration.paswordFirebase));
      authenticateWithEmailAndPasswordCb(user?.userName, "Dr123qwe");
      hasFirebaseauth.current = true;
    }
  }, [auth, user, authenticateWithEmailAndPasswordCb]);

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
    throw new Error(
      "ConfigurationsProvider must be used within an AuthProvider"
    );
  }
  return context;
};
