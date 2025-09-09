
import { FirebaseMessagingHelper } from "./hooks/useFirebaseMessaginHelper";
import { FirebaseRealtimeHelper } from "./hooks/useFirebaseRealTimeHelpet";
import { FirebaseStorageHelper } from "./hooks/useFirebaseStorageHelper";
export interface UseFirebasereturn {
  firebasestorage: FirebaseStorageHelper;
  firebaserealtime: FirebaseRealtimeHelper;
  firebaseMessaging: FirebaseMessagingHelper;
  permissionsChanged: { state: boolean; newPermissions: string };
  firebaseLogginFail: boolean;
}