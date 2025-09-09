import { v4 as uuidv4 } from "uuid";

import { User, UserDoc, LoginCredentials } from "../types";

import { intranetClient } from "@/app/configurations/Axios/Clients";
import { basicPost } from "@/app/configurations/Axios/GenericMethods";
import { LoginUrl, VerifyOTP } from "@/app/configurations/Axios/urls";
import { lastuserremebered } from "@/app/configurations/DataBase/bases";
import {
  createDocument,
  readDocumentById,
  updateDocumentById,
  deleteDocument,
} from "@/app/configurations/DataBase/crud";

const USER_DOC_ID = 1;
/**
 * Inicia sesión de usuario autenticando contra backend o local.
 * Guarda el usuario actual y recordado si aplica.
 */
export const authenticateUser = async (
  credentials: { email: string; password: string },
  userRemeber: boolean,
  offlineMode: boolean
): Promise<void> => {
  const deviceId = await getDeviceId();
  let user: User | null = null;
  if (offlineMode) {
    const userDoc = await readUserRemebered();
    if (userDoc) {
      user = userDoc.user;
    }
  } else {
    user = await loginUser(credentials, deviceId);
  }
  if (user) {

    const treeFirebase = (typeof user?.treeFirebase === 'string') ? user?.treeFirebase : JSON.stringify(user?.treeFirebase);
    const userToSave = { ...user, password: credentials.password, treeFirebase: treeFirebase }
    if (userRemeber) await saveLastUserRemebered(userToSave);
    await saveUser(userToSave);
  }
};
/**
 * Realiza la petición de inicio de sesión al backend.
 */
const loginUser = async (
  credentials: LoginCredentials,
  deviceId: string
): Promise<User> => {
  return new Promise((resolve, reject) => {
    basicPost(
      intranetClient,
      LoginUrl,
      { ...credentials, deviceId },
      (response) => {
        if (response instanceof Error) {
          reject(response);
        } else {
          resolve(response.data.data);
        }
      }
    );
  });
};
/**
 * Valida un código OTP recibido por el usuario.
 */
export const validateOTP = async (
  token: string,
  otp: string
): Promise<User> => {
  return new Promise((resolve, reject) => {
    basicPost(intranetClient, VerifyOTP, { token, otp }, (response) => {
      if (response instanceof Error) {
        reject(response);
      } else {
        resolve(response.data);
      }
    });
  });
};
/**
 * Solicita al backend que envíe un correo con OTP al usuario.
 */
export const sendOTPEmail = async (token: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    basicPost(intranetClient, VerifyOTP, { token }, (response) => {
      if (response instanceof Error) {
        reject(response);
      } else {
        resolve(response.data);
      }
    });
  });
};
/**
 * Guarda el usuario autenticado localmente.
 */
export const saveUser = async (user: User): Promise<void> => {
  const userdoc: UserDoc = { id: USER_DOC_ID, user };
  try {
    const existingUser = await readDocumentById(USER_DOC_ID);
    if (existingUser) {
      await updateDocumentById(USER_DOC_ID, userdoc);
    }
  } catch (err) {
    if (err instanceof Error) {
      await createDocument(userdoc);
    } else {
      // console.error("Error al leer usuario:", err);
      throw err;
    }
  }
};
/**
 * Guarda el último usuario recordado en base local.
 */
export const saveLastUserRemebered = async (user: User): Promise<void> => {
  const lastuser: UserDoc = { id: USER_DOC_ID, user };
  try {
    const existingUser = await readDocumentById(USER_DOC_ID, lastuserremebered);
    if (existingUser) {
      await updateDocumentById(USER_DOC_ID, lastuser, lastuserremebered);
    }
  } catch (err) {
    if (err instanceof Error) {
      await createDocument(lastuser, lastuserremebered);
    } else {
      // console.error("Error al leer usuario:", err);
      throw err;
    }
  }
};

/**
 * Lee el usuario autenticado almacenado localmente.
 */
export const readUser = async (): Promise<UserDoc | null> => {
  const user = await readDocumentById(USER_DOC_ID);
  return (user as UserDoc) || null;
};
/**
 * Lee el último usuario recordado almacenado localmente.
 */
export const readUserRemebered = async (): Promise<UserDoc | null> => {
  const user = await readDocumentById(USER_DOC_ID, lastuserremebered);
  return (user as UserDoc) || null;
};
/**
 * Elimina los datos del usuario autenticado actual.
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await deleteDocument(USER_DOC_ID);
  } catch (err) {
    console.error("Error al cerrar sesión:", err);
    throw err;
  }
};
/**
 * Elimina el usuario recordado localmente.
 */

export const forgetUser = async (): Promise<void> => {
  try {
    await deleteDocument(USER_DOC_ID, lastuserremebered);
  } catch (err) {
    console.error("Error al cerrar sesión:", err);
    throw err;
  }
};
/**
 * Retorna el ID único del dispositivo actual o lo genera si no existe.
 */
export const getDeviceId = async (): Promise<string> => {
  const docId = "deviceIdDoc";
  try {
    const deviceId = localStorage.getItem(docId);
    if (deviceId) {
      return deviceId;
    } else {
      const newDeviceId = uuidv4();
      localStorage.setItem(docId, newDeviceId);
      return newDeviceId;
    }
  } catch (err) {
    console.error("Error al obtener deviceId:", err);
    throw err;
  }
};

/**
 * Guarda el token de Firebase localmente.
 */

export const saveFirebaseToken = async (token: string): Promise<void> => {
  const docId = "firebaseTokenDoc";
  try {
    localStorage.setItem(docId, token);
  } catch (err) {
    console.error("Error al guardar firebaseToken:", err);
    throw err;
  }
};
/**
 * Lee el token de Firebase almacenado localmente.
 */
export const readFirebaseToken = async (): Promise<string | null> => {
  const docId = "firebaseTokenDoc";
  try {
    const token = localStorage.getItem(docId);
    return token ? token : null;
  } catch (err) {
    console.error("Error al leer firebaseToken:", err);
    throw err;
  }
};
