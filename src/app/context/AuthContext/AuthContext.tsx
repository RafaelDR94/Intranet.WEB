'use client';
import React, { createContext, useState, useEffect, ReactNode, useMemo } from "react";
import { intranetClient } from "@/app/configurations/Axios/Clients";
import { User, AuthContextType } from "./types";
import {
  authenticateUser,
  readUser,
  logoutUser,
  validateOTP,
  sendOTPEmail,
  saveUser,
  saveLastUserRemebered,
  readUserRemebered,
  forgetUser,
} from "./utilities/AuthService";
import usePermissions from "./hooks/usePermissions";

/**
 * Contexto de autenticación que proporciona el estado global del usuario,
 * funciones de login, logout, OTP y control de permisos.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Proveedor de autenticación global.
 * Debe envolver a la aplicación o layout principal para exponer el contexto.
 *
 * @param {ReactNode} children - Componentes hijos que tendrán acceso al contexto.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRemebered, setUserRemebered] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hasExpired, setHasExpired] = useState(false);
  const [remeberMe, setRemeberMe] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  const { validPermissionsbyroute, getRoutePermissions } = usePermissions({ user });

  /** Carga el usuario autenticado desde almacenamiento local (IndexedDB o similar). */
  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = await readUser();
      if (userDoc) {
        setUser(userDoc.user);
        setToken(userDoc.user.token);
      }
    };
    fetchUser();
  }, []);

  /** Carga el último usuario recordado si existe. */
  useEffect(() => {
    const fetchUserRemebered = async () => {
      const userDoc = await readUserRemebered();
      if (userDoc) {
        setRemeberMe(true);
        setUserRemebered(userDoc.user);
      }
    };
    fetchUserRemebered();
  }, []);

  /** Envía mensaje al service worker para habilitar/deshabilitar modo offline. */
  useEffect(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_ONLY_MODE',
        payload: offlineMode === true
      });
    }
  }, [offlineMode]);

  /** Interceptor que agrega token de autenticación a las peticiones HTTP salientes. */
  useEffect(() => {
    if (!intranetClient) return;

    let interceptorId: number | null = null;
    if (user?.token) {
      interceptorId = intranetClient.interceptors.request.use(
        (config) => {
          const token = user?.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => {
          window.location.href = "/Login";
          return Promise.reject(error);
        }
      );
    }

    return () => {
      if (interceptorId !== null) {
        intranetClient.interceptors.request.eject(interceptorId);
      }
    };
  }, [intranetClient, user?.token]);

  /**
   * Inicia sesión autenticando al usuario.
   * @param credentials - Objeto con email y password.
   */
  const login = async (credentials: { email: string; password: string }) => {
    setHasExpired(false);
    await authenticateUser(credentials, remeberMe, offlineMode);
    const userDoc = await readUser();
    if (userDoc) {
      setUser(userDoc.user);
      setToken(userDoc.user.token);
    }
  };

  /**
   * Actualiza manualmente los datos del usuario en el almacenamiento.
   * @param user - Objeto de usuario actualizado.
   */
  const UpdateUser = async (user: User) => {
    await saveUser(user);
    await saveLastUserRemebered(user);
    setUser(user);
  };

  /**
   * Actualiza los permisos (`treeFirebase`) del usuario.
   * @param permissions - Permisos como string serializado.
   */
  const updateUserPermissions = async (permissions: string) => {
    if (user) {
      const newUser: User = { ...user, treeFirebase: permissions };
      await saveUser(newUser);
      await saveLastUserRemebered(newUser);
      setUser(newUser);
    } else {
      console.error("No se pudo actualizar el usuario");
    }
  };

  /**
   * Valida un código OTP ingresado por el usuario.
   * @param optcode - Código recibido por email.
   */
  const verifyOTP = async (optcode: string) => {
    await validateOTP(token ?? "", optcode);
    const userDoc = await readUser();
    if (userDoc) {
      setUser(userDoc.user);
      setToken(userDoc.user.token);
    }
  };

  /** Solicita el envío de OTP al correo del usuario. */
  const askforOTPemail = async () => {
    await sendOTPEmail(token ?? "");
  };

  /** Cierra sesión, borra tokens y limpia almacenamiento. */
  const logout = async () => {
    await logoutUser();
    setUser(null);
    setToken(null);

    const firebaseToken = localStorage.getItem("firebaseTokenDoc");
    const deviceId = localStorage.getItem("deviceIdDoc");

    localStorage.clear();
    if (firebaseToken) localStorage.setItem("firebaseTokenDoc", firebaseToken);
    if (deviceId) localStorage.setItem("deviceIdDoc", deviceId);

    sessionStorage.clear();
  };

  /** Valida si la sesión del usuario sigue activa. */
  const validLoggin = async () => {
    if (user) {
      const lifeToken = user.lifeToken;
      const lifeTokenDate = new Date(lifeToken.replace("Z", ""));
      const currentDate = new Date();
      if ((currentDate >= lifeTokenDate) && !offlineMode) {
        setHasExpired(true);
        return false;
      }
      return true;
    }
    return false;
  };

  /**
   * Establece si se debe recordar al usuario localmente.
   * @param rememberme - `true` para activar.
   */
  const handleRemeberMe = (rememberme: boolean) => {
    setRemeberMe(rememberme);
  };

  /**
   * Habilita o deshabilita el modo offline (solo cache).
   * @param offline - `true` para activar.
   */
  const handleOfflineMode = (offline: boolean) => {
    setOfflineMode(offline);
  };

  /** Elimina al usuario recordado en almacenamiento local. */
  const handleForgetUser = async () => {
    await forgetUser();
    setRemeberMe(false);
    setUserRemebered(null);
  };

  /** Contexto exportado con memoización. */
  const contextValue = useMemo(() => ({
    user,
    token,
    hasExpired,
    remeberMe,
    userRemebered,
    offlineMode,
    handleForgetUser,
    login,
    logout,
    verifyOTP,
    askforOTPemail,
    validLoggin,
    validPermissionsbyroute,
    UpdateUser,
    setHasExpired,
    handleRemeberMe,
    handleOfflineMode,
    getRoutePermissions,
    updateUserPermissions
  }), [
    user,
    token,
    hasExpired,
    remeberMe,
    userRemebered,
    offlineMode
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para consumir el contexto de autenticación.
 * 
 * @returns {AuthContextType} Objeto con el estado y funciones del usuario autenticado.
 * @throws Error si se llama fuera del `AuthProvider`.
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
