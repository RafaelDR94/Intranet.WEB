'use client';
import React from 'react';
import { usePermissionRedirect } from './hooks/usePermissionRedirect';
import { container, message, button } from './styles';
import type { PermissionRedirectProps } from './types';

/**
 * Redirects to the first permitted route.
 * Shows a fallback with navigation to home when none are allowed.
 */
export const PermissionRedirect: React.FC<PermissionRedirectProps> = (props) => {
  const { authorized, goHome } = usePermissionRedirect(props);

  if (authorized === false) {
    return (
      <div className={container}>
        <p className={message}>No tienes permisos para esta sección.</p>
        <button className={button} onClick={goHome}>
          Ir al inicio
        </button>
      </div>
    );
  }

  return null;
};
