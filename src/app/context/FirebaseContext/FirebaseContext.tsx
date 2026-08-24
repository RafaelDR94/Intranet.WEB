"use client";

import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  User,
  getAuth,
  onAuthStateChanged,
  signInWithCustomToken,
  signOut,
} from "firebase/auth";
import { Database, getDatabase } from "firebase/database";
import { Messaging, getMessaging } from "firebase/messaging";
import { FirebaseStorage, getStorage } from "firebase/storage";
import React, {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useAuth } from "../AuthContext/AuthContext";
import {
  clearFirebaseToken,
  getDeviceId,
  readFirebaseToken,
  readNotificationPermission,
  saveFirebaseToken,
  saveNotificationPermission,
} from "../AuthContext/utilities/AuthService";

import useFirebaseMessagingHelper from "./hooks/useFirebaseMessaginHelper";
import useFirebaseRealtimeHelper from "./hooks/useFirebaseRealTimeHelpet";
import useFirebaseStorageHelper from "./hooks/useFirebaseStorageHelper";
import {
  NotificationDeviceRecord,
  NotificationPermissionState,
  buildLegacyNotificationDevicePath,
  buildNotificationDevicePath,
  buildNotificationPreferencesPath,
  defaultNotificationPreferences,
} from "./notificationPaths";
import { usePermissionsListener } from "./hooks/usePermissionsListener";
import Uselogs from "./hooks/uselogs";
import { UseFirebasereturn } from "./types";

import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";
import { fetchFirebaseCustomToken } from "@/app/services/auth/FirebaseSessionService";

export const FirebaseContext = createContext<UseFirebasereturn | undefined>(
  undefined,
);

const getNavigatorMetadata = () => ({
  deviceName:
    typeof navigator !== "undefined" ? navigator.platform || null : null,
  platform: typeof navigator !== "undefined" ? navigator.platform || "" : "",
  userAgent: typeof navigator !== "undefined" ? navigator.userAgent || "" : "",
});

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const previousUserIdRef = useRef<string | null>(null);
  const firebaseReadyTokenRef = useRef<string | null>(null);
  const firebaseFailedTokenRef = useRef<string | null>(null);
  const firebaseWaitersRef = useRef(
    new Map<string, Array<{ resolve: () => void; reject: (reason: Error) => void }>>(),
  );
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [storage, setStorage] = useState<FirebaseStorage | null>(null);
  const [database, setDatabase] = useState<Database | null>(null);
  const [messaging, setMessaging] = useState<Messaging | null>(null);
  const [firebaseSessionStatus, setFirebaseSessionStatus] = useState<
    "idle" | "authenticating" | "ready" | "error"
  >("idle");
  const [firebaseSessionError, setFirebaseSessionError] = useState("");
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);
  const [firebaseConfiguration, setFirebaseConfiguration] = useState<any | null>(
    null,
  );
  const firebasestorage = useFirebaseStorageHelper(storage);
  const firebaserealtime = useFirebaseRealtimeHelper(database);
  const firebaseMessaging = useFirebaseMessagingHelper(messaging);
  const { user, setHasExpired, offlineMode } = useAuth();
  const permissions = usePermissionsListener(database, firebaseUid);
  const updateUserPermissions = useAuthStore((state) => state.updateUserPermissions);
  const setAuthFirebaseSessionStatus = useAuthStore(
    (state) => state.setFirebaseSessionStatus,
  );
  const permissionsChanged = {
    state: permissions !== null,
    newPermissions: permissions ?? "",
  };

  useEffect(() => {
    if (permissions !== null && firebaseSessionStatus === "ready") {
      void updateUserPermissions(permissions);
    }
  }, [firebaseSessionStatus, permissions, updateUserPermissions]);

  const settleFirebaseWaiters = useCallback(
    (backendToken: string, error?: Error) => {
      const waiters = firebaseWaitersRef.current.get(backendToken) ?? [];
      firebaseWaitersRef.current.delete(backendToken);
      waiters.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
    },
    [],
  );

  const waitForFirebaseReady = useCallback(
    (backendToken: string): Promise<void> => {
      if (firebaseReadyTokenRef.current === backendToken) return Promise.resolve();
      if (firebaseFailedTokenRef.current === backendToken) {
        return Promise.reject(new Error("No se pudo iniciar la sesión de Firebase."));
      }

      return new Promise((resolve, reject) => {
        const waiters = firebaseWaitersRef.current.get(backendToken) ?? [];
        waiters.push({ resolve, reject });
        firebaseWaitersRef.current.set(backendToken, waiters);
      });
    },
    [],
  );

  const resolveNotificationPermission = useCallback(
    async (): Promise<NotificationPermissionState> => {
      if (typeof Notification === "undefined") {
        await saveNotificationPermission("unsupported");
        return "unsupported";
      }

      let permission = Notification.permission;
      if (permission === "default") {
        permission = await Notification.requestPermission();
      }

      await saveNotificationPermission(permission);
      return permission;
    },
    [],
  );

  const syncNotificationPreferences = useCallback(async () => {
    if (!user?.idUser || !firebaserealtime) return;

    const preferencesPath = buildNotificationPreferencesPath(user.idUser);
    const existingPreferences = await firebaserealtime.getData(preferencesPath);

    if (!existingPreferences) {
      await firebaserealtime.setData(
        preferencesPath,
        defaultNotificationPreferences,
      );
    }
  }, [firebaserealtime, user?.idUser]);

  const registerNotificationDevice = useCallback(
    async (firebaseUser: User | null) => {
      if (!firebaseUser || !user?.idUser || !firebaserealtime || !firebaseMessaging)
        return;

      const deviceId = await getDeviceId();
      const devicePath = buildNotificationDevicePath(user.idUser, deviceId);
      const legacyDevicePath = buildLegacyNotificationDevicePath(
        user.idUser,
        deviceId,
      );
      const now = new Date().toISOString();
      const permission = await resolveNotificationPermission();
      const existingDevice = (await firebaserealtime.getData(
        devicePath,
      )) as Partial<NotificationDeviceRecord> | null;
      const storedToken = await readFirebaseToken();
      const storedPermission = await readNotificationPermission();
      const metadata = getNavigatorMetadata();

      if (permission !== "granted") {
        const revokedRecord: NotificationDeviceRecord = {
          createdAt: existingDevice?.createdAt ?? now,
          deviceId,
          lastSeenAt: now,
          permission,
          status: "revoked",
          token: null,
          updatedAt: now,
          ...metadata,
        };

        await clearFirebaseToken();
        await firebaserealtime.setData(devicePath, revokedRecord);
        await firebaserealtime.deleteData(legacyDevicePath);
        return;
      }

      const token = await firebaseMessaging.getMessagingToken();
      const nextDevice: NotificationDeviceRecord = {
        createdAt: existingDevice?.createdAt ?? now,
        deviceId,
        lastSeenAt: now,
        permission,
        status: "active",
        token,
        updatedAt: now,
        ...metadata,
      };
      const hasMeaningfulChange =
        !existingDevice ||
        existingDevice.token !== token ||
        existingDevice.permission !== permission ||
        existingDevice.deviceName !== nextDevice.deviceName ||
        existingDevice.platform !== nextDevice.platform ||
        existingDevice.status !== nextDevice.status ||
        existingDevice.userAgent !== nextDevice.userAgent ||
        storedToken !== token ||
        storedPermission !== permission;

      await saveFirebaseToken(token);

      if (hasMeaningfulChange) {
        await firebaserealtime.setData(devicePath, nextDevice);
      } else {
        await firebaserealtime.updateData(devicePath, {
          lastSeenAt: now,
          updatedAt: now,
        });
      }

      await firebaserealtime.setData(legacyDevicePath, token);
    },
    [
      firebaseMessaging,
      firebaserealtime,
      resolveNotificationPermission,
      user?.idUser,
    ],
  );

  const cleanupNotificationDevice = useCallback(
    async (targetUserId: string) => {
      if (!firebaserealtime) return;

      const deviceId = await getDeviceId();
      const devicePath = buildNotificationDevicePath(targetUserId, deviceId);
      const legacyDevicePath = buildLegacyNotificationDevicePath(
        targetUserId,
        deviceId,
      );
      const existingDevice = (await firebaserealtime.getData(
        devicePath,
      )) as Partial<NotificationDeviceRecord> | null;

      if (existingDevice) {
        const now = new Date().toISOString();
        const permission =
          (await readNotificationPermission()) ??
          (typeof Notification !== "undefined"
            ? Notification.permission
            : "unsupported");

        await firebaserealtime.setData(devicePath, {
          createdAt: existingDevice.createdAt ?? now,
          deviceId,
          lastSeenAt: now,
          permission,
          status: "revoked",
          token: null,
          updatedAt: now,
          ...getNavigatorMetadata(),
        } satisfies NotificationDeviceRecord);
      }

      await firebaserealtime.deleteData(legacyDevicePath);
    },
    [firebaserealtime],
  );

  useEffect(() => {
    const backendToken = user?.token;
    let cancelled = false;

    const clearFirebaseSession = async () => {
      firebaseReadyTokenRef.current = null;
      firebaseFailedTokenRef.current = null;
      setFirebaseUid(null);
      setFirebaseSessionError("");
      setAuthFirebaseSessionStatus("idle");
      setFirebaseSessionStatus("idle");

      if (auth?.currentUser) {
        try {
          await signOut(auth);
        } catch (error) {
          console.error("No se pudo cerrar la sesión Firebase:", error);
        }
      }
    };

    if (!auth || !backendToken) {
      void clearFirebaseSession();
      return;
    }

    if (firebaseReadyTokenRef.current === backendToken) return;

    const authenticate = async () => {
      firebaseFailedTokenRef.current = null;
      setFirebaseUid(null);
      setFirebaseSessionError("");
      setAuthFirebaseSessionStatus("authenticating");
      setFirebaseSessionStatus("authenticating");

      try {
        const customToken = await fetchFirebaseCustomToken(backendToken);
        const credential = await signInWithCustomToken(auth, customToken);

        if (!credential.user.uid) {
          throw new Error("Firebase no devolvió un UID de usuario.");
        }

        if (cancelled) {
          await signOut(auth);
          return;
        }

        firebaseReadyTokenRef.current = backendToken;
        setFirebaseUid(credential.user.uid);
        setAuthFirebaseSessionStatus("ready");
        setFirebaseSessionStatus("ready");
        settleFirebaseWaiters(backendToken);
      } catch (error) {
        const sessionError =
          error instanceof Error
            ? error
            : new Error("No se pudo iniciar la sesión de Firebase.");

        if (cancelled) return;

        firebaseFailedTokenRef.current = backendToken;
        setFirebaseUid(null);
        setFirebaseSessionError(sessionError.message);
        setAuthFirebaseSessionStatus("error");
        setFirebaseSessionStatus("error");
        settleFirebaseWaiters(backendToken, sessionError);

        try {
          await signOut(auth);
        } catch (signOutError) {
          console.error("No se pudo cerrar la sesión Firebase tras un error:", signOutError);
        }

        // Fail closed: elimina la sesión backend/local; el logout remoto es opcional por entorno.
        void useAuthStore.getState().logout();
      }
    };

    void authenticate();
    return () => {
      cancelled = true;
    };
  }, [auth, settleFirebaseWaiters, setAuthFirebaseSessionStatus, user?.token]);

  useEffect(() => {
    if (
      !auth ||
      firebaseSessionStatus !== "ready" ||
      !user?.idUser ||
      !firebaserealtime ||
      !firebaseMessaging
    ) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;

      try {
        await syncNotificationPreferences();
        await registerNotificationDevice(firebaseUser);
      } catch (err) {
        console.error("Error manejando el token de notificacion:", err);
      }
    });

    return () => unsubscribe();
  }, [
    auth,
    firebaseMessaging,
    firebaseSessionStatus,
    firebaserealtime,
    registerNotificationDevice,
    syncNotificationPreferences,
    user?.idUser,
  ]);

  useEffect(() => {
    const previousUserId = previousUserIdRef.current;

    if (previousUserId && !user?.idUser) {
      void cleanupNotificationDevice(previousUserId);
    }

    previousUserIdRef.current = user?.idUser ?? null;
  }, [cleanupNotificationDevice, user?.idUser]);

  Uselogs({ firebaserealtime, database, user, setHasExpired, offlineMode });

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
          measurementId: "G-SMY838399L",
        };

        setFirebaseConfiguration({ firebaseConfig });
      }, 2000);
    }

  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      void GetFirebaseConfigurations();
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (firebaseConfiguration && !app) {
      setApp(initializeApp(firebaseConfiguration.firebaseConfig));
    }
  }, [app, firebaseConfiguration]);

  useEffect(() => {
    if (app) {
      setAuth(getAuth(app));
      setStorage(getStorage(app));
      setDatabase(getDatabase(app));
      setMessaging(getMessaging(app));
    }
  }, [app]);

  return (
    <FirebaseContext.Provider
      value={{
        firebasestorage,
        firebaserealtime,
        permissionsChanged,
        firebaseMessaging,
        firebaseSessionStatus,
        firebaseSessionError,
        waitForFirebaseReady,
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
      "ConfigurationsProvider must be used within an AuthProvider",
    );
  }
  return context;
};
