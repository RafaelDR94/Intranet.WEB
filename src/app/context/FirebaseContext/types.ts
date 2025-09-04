
import { FirebaseMessagingHelper } from "./hooks/useFirebaseMessaginHelper";
import { FirebaseStorageHelper } from "./hooks/useFirebaseStorageHelper";
import { FirebaseRealtimeHelper } from "./hooks/useFirebaseRealTimeHelpet";
export interface UseFirebasereturn {
  firebasestorage: FirebaseStorageHelper;
  firebaserealtime: FirebaseRealtimeHelper;
  firebaseMessaging: FirebaseMessagingHelper;
  permissionsChanged: { state: boolean; newPermissions: string };
  firebaseLogginFail: boolean;
}