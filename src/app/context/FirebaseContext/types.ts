
import { FirebaseMessagingHelper } from "./hooks/useFirebaseMessaginHelper";
import { FirebaseRealtimeHelper } from "./hooks/useFirebaseRealTimeHelpet";
import { FirebaseStorageHelper } from "./hooks/useFirebaseStorageHelper";
import type { FirebaseSessionStatus } from "../AuthContext/types";
export interface UseFirebasereturn {
  firebasestorage: FirebaseStorageHelper;
  firebaserealtime: FirebaseRealtimeHelper;
  firebaseMessaging: FirebaseMessagingHelper;
  permissionsChanged: { state: boolean; newPermissions: string };
  firebaseSessionStatus?: FirebaseSessionStatus;
  firebaseSessionError?: string;
  /** Espera la autenticación Firebase de una sesión concreta del backend. */
  waitForFirebaseReady?: (backendToken: string) => Promise<void>;
}
