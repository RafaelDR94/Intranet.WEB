/**
 * Representa las credenciales para iniciar sesión.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Representa un usuario del sistema.
 */
export interface User {
  fullName: string;
  employeeNumber: string;
  userName: string;
  changePassword: boolean;
  idEmployee: string;
  idUser: string;
  idRol: string;
  lifeToken: string;
  rolName: string;
  token: string;
  imageProfile: string;
  treeFirebase: string;
  nip: string;
  activeNIP: boolean;
  idWorkPosition: string;
  workPositionName: string;
  idEnterprise: string;
  idDepartment: string;
  password: string;
  signature: string;
}

/**
 * Documento que contiene un usuario y campos adicionales.
 */
export interface UserDoc {
  _id?: number;
  user: User;
  [key: string]: any;
}

/**
 * Documento que representa un dispositivo.
 */
export type DeviceDocument = {
  _id: string;
  deviceId: string;
  _rev?: string;
};

/**
 * Interfaz del contexto de autenticación global.
 */
export interface AuthContextType {
  user: User | null;
  userRemebered: User | null;
  token: string | null;
  hasExpired: boolean;
  remeberMe: boolean;
  offlineMode: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  verifyOTP: (optcode: string) => Promise<void>;
  askforOTPemail: () => Promise<void>;
  validLoggin: () => Promise<boolean>;
  validPermissionsbyroute: (route: string) => boolean;
  UpdateUser: (user: User) => Promise<void>;
  setHasExpired: React.Dispatch<React.SetStateAction<boolean>>;
  handleRemeberMe: (rememberme: boolean) => void;
  handleForgetUser: () => Promise<void>;
  handleOfflineMode: (offline: boolean) => void;
  getRoutePermissions: (route: string) => any;
  updateUserPermissions: (permissions: string) => Promise<void>;
}
