/**
 * Props for the Notification component.
 */
export type NotificationProps = {
  /** Primary title shown in the notification body. */
  title: string;
  /** Optional description/body text. */
  description?: string;
  /** ISO date string or Date used to render the timestamp. */
  createdAt?: string | Date;
  /** Optional header label for the notification container. */
  headerLabel?: string;
  /** Label for the action button. */
  actionLabel?: string;
  /** Callback when the action button is clicked. */
  onAction?: () => void;
  /** Callback when the notification is closed. */
  onClose?: () => void;
  /** Avatar image source. */
  avatarSrc?: string;
  /** Avatar alt text. */
  avatarAlt?: string;
  /** Avatar initials fallback. */
  avatarInitials?: string;
  /** Show unread indicator dot. */
  showIndicator?: boolean;
  /** Optional className for the root container. */
  className?: string;
  /** Optional test id for the root container. */
  dataTestId?: string;
};
