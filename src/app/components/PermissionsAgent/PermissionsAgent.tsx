'use client';

import { usePathname, redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Spinner } from '../Spinner/Spinner';

import { loadingContainer, spinnerLabel, notPermissions } from './styles';
import { PermissionAgentProps } from './types';

import { useAuth } from '@/app/context/AuthContext/AuthContext';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
/**
 * Componente guardián que impide renderizar el contenido si el usuario no
 * cuenta con permisos sobre la ruta actual.
 */
export const PermissionAgent: React.FC<PermissionAgentProps> = ({
  children,
  fallbackPath = '/home',
  strictPath,
}) => {
  const { validPermissionsbyroute, user, hasExpired } = useAuth();
  const { usePrincipalAlert } = usePrincipal();
  const { showAlert } = usePrincipalAlert;
  const pathname = usePathname();
  const routeToCheck = strictPath ?? pathname;

  const [checking, setChecking] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (hasExpired) {
      showAlert({
        type: "info",
        variant: "subtle",
        title: "Sesión caducada",
        description: "El tiempo activo de tu sesión ha finalizado",
        autoCloseMs: 2000,
        showPrimaryButton: false,
        showSecondaryButton: false
      });
      setTimeout(() => {
        redirect("/login")
      }, 2000)
    }

  }, [hasExpired, showAlert])

  useEffect(() => {
    const evaluatePermissions = () => {
      const result = validPermissionsbyroute(routeToCheck);
      setHasPermission(result);
      setChecking(false);
    };

    const timeoutId: ReturnType<typeof setTimeout> = setTimeout(evaluatePermissions, 150);

    return () => clearTimeout(timeoutId);
  }, [user?.treeFirebase, routeToCheck, validPermissionsbyroute]);
  
  if (checking || hasPermission === null) {
    return (
      <div className={loadingContainer}>
        <Spinner size="giant" />
        <p className={spinnerLabel}>Cargando contenido...</p>
      </div>
    );
  }

  if (!hasPermission) {
    if (routeToCheck.includes('main-page/home')) {
      return (
        <div className={notPermissions}>
          No tienes permisos para acceder a esta sección.
        </div>
      );
    } else {
      redirect(fallbackPath);
    }
  }

  return <>{children}</>;
};

