export const NOTIFICATIONS_ROOT = "Notifications";
export const NOTIFICATION_DEVICES_SEGMENT = "Devices";
export const NOTIFICATION_PENDING_SEGMENT = "Pending";
export const NOTIFICATION_PREFERENCES_SEGMENT = "Preferences";

export type NotificationDeviceStatus = "active" | "revoked";

export type NotificationPermissionState =
  | NotificationPermission
  | "unsupported";

export type NotificationDeviceRecord = {
  createdAt: string;
  deviceId: string;
  deviceName: string | null;
  lastSeenAt: string;
  permission: NotificationPermissionState;
  platform: string;
  status: NotificationDeviceStatus;
  token: string | null;
  updatedAt: string;
  userAgent: string;
};

export type NotificationPreferences = {
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
};

export const defaultNotificationPreferences: NotificationPreferences = {
  pushEnabled: true,
  emailEnabled: false,
  smsEnabled: true,
};

export const buildNotificationsUserPath = (userId: string) =>
  `${NOTIFICATIONS_ROOT}/${userId}`;

export const buildNotificationDevicesPath = (userId: string) =>
  `${buildNotificationsUserPath(userId)}/${NOTIFICATION_DEVICES_SEGMENT}`;

export const buildNotificationDevicePath = (userId: string, deviceId: string) =>
  `${buildNotificationDevicesPath(userId)}/${deviceId}`;

export const buildLegacyNotificationDevicePath = (
  userId: string,
  deviceId: string,
) => `${buildNotificationsUserPath(userId)}/${deviceId}`;

export const buildNotificationPendingPath = (userId: string) =>
  `${buildNotificationsUserPath(userId)}/${NOTIFICATION_PENDING_SEGMENT}`;

export const buildNotificationPreferencesPath = (userId: string) =>
  `${buildNotificationsUserPath(userId)}/${NOTIFICATION_PREFERENCES_SEGMENT}`;
