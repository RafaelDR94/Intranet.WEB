export interface OfflineMessage {
  open: boolean;
  offlineMode: boolean;
  messsage: string;
}

export type PendingNotification = {
  id: string;
  title: string;
  body?: string;
  data?: Record<string, string>;
  createdAt?: string;
  avatarSrc?: string;
};
