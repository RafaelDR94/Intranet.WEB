'use client';
import React from 'react';

import { PermissionRedirect } from './PermissionRedirect';

export const PermissionRedirectCatalog: React.FC = () => (
  <PermissionRedirect
    routes={['/private']}
    permissionChecker={() => false}
    router={{ replace: () => {}, push: () => {} }}
  />
);
