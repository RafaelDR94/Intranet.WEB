import React from 'react';

import Notification from './Notification';
import { NotificationProps } from './types';

export const NotificationCatalog = (props: NotificationProps) => (
  <div style={{ width: '100%' }}>
    <Notification {...props} />
  </div>
);

export default NotificationCatalog;
