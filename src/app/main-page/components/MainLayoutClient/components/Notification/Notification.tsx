'use client';

import clsx from 'clsx';
import React, { useMemo } from 'react';

import Avatar from '@/app/components/Avatar/Avatar';
import { Button } from '@/app/components/Button/Button';
import CloseIcon from '@/assets/icons/acciones/cancel.svg';

import * as styles from './styles';
import { NotificationProps } from './types';

const formatNotificationTime = (createdAt?: string | Date) => {
  if (!createdAt) return '';
  const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

/**
 * Notification card used to display incoming push notifications.
 */
const Notification: React.FC<NotificationProps> = ({
  title,
  description,
  createdAt,
  headerLabel = 'NOTIFICACION NUEVA',
  actionLabel = 'Ir a evento',
  onAction,
  onClose,
  avatarSrc,
  avatarAlt,
  avatarInitials,
  showIndicator = true,
  className,
  dataTestId = 'notification',
}) => {
  const timeLabel = useMemo(() => formatNotificationTime(createdAt), [createdAt]);

  return (
    <div
      className={clsx(styles.container, className)}
      data-testid={dataTestId}
      role="status"
      aria-live="polite"
    >
      <div className={styles.header}>
        <span className={styles.headerTitle}>{headerLabel}</span>
        <button
          type="button"
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Cerrar notificacion"
        >
          <CloseIcon />
        </button>
      </div>
      <div className={styles.body}>
        <Avatar
          src={avatarSrc}
          alt={avatarAlt ?? title}
          initials={avatarInitials}
          size="tiny"
          online={false}
          className="bg-turquoise-80 text-white-100 text-s2"
        />
        <div className={styles.content}>
          <div className={styles.messageRow}>
            <p className={styles.title}>{title}</p>
            {showIndicator ? <span className={styles.indicator} aria-hidden /> : null}
          </div>
          {description ? <p className={styles.description}>{description}</p> : null}
          <div className={styles.metaRow}>
            {timeLabel ? <p className={styles.time}>{timeLabel}</p> : null}
            <div className={styles.action}>
              <Button
                variant="ghost"
                size="xsmall"
                onClick={onAction}
                className="text-turquoise-80 hover:bg-turquoise-10 focus:text-turquoise-80 focus:ring-turquoise-40 active:text-turquoise-100"
              >
                {actionLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
