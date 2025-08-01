'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext/AuthContext';
import { usePathname, redirect } from 'next/navigation';
import { Spinner } from '../Spinner/Spinner';

interface Props {
  children: React.ReactNode;
  fallbackPath?: string;
  strictPath?: string;
}

/**
 * PermissionAgent – componente guardián que impide renderizar
 * contenido si el usuario no tiene permisos sobre la ruta actual.
 */
export const PermissionAgent: React.FC<Props> = ({
  children,
  fallbackPath = '/home',
  strictPath,
}) => {
  const { validPermissionsbyroute, user } = useAuth();
  const pathname = usePathname();
  const routeToCheck = strictPath ?? pathname;

  const [checking, setChecking] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const evaluatePermissions = () => {
      const result = validPermissionsbyroute(routeToCheck);
      setHasPermission(result);
      setChecking(false);
    };

    // Esperamos 100ms por si treeFirebase aún no está
    timeout = setTimeout(evaluatePermissions, 150);

    return () => clearTimeout(timeout);
  }, [user?.treeFirebase, routeToCheck]);

  if (checking || hasPermission === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col gap-4">
        <Spinner size="giant" />
        <p className="text-gray-70 text-b2">Cargando contenido...</p>
      </div>
    );
  }

  if (!hasPermission) {
    if (routeToCheck.includes('main-page/home')) {
      return (
        <div className="p-6 text-red-600">
          No tienes permisos para acceder a esta sección.
        </div>
      );
    } else {
      redirect(fallbackPath);
    }
  }

  return <>{children}</>;
};
