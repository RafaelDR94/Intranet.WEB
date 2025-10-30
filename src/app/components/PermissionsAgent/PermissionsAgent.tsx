'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import { Spinner } from '../Spinner/Spinner';

import { loadingContainer, spinnerLabel, notPermissions } from './styles';
import { PermissionAgentProps } from './types';

import { useAuth } from '@/app/context/AuthContext/AuthContext';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';

export const PermissionAgent: React.FC<PermissionAgentProps> = ({
  children,
  // Redirigir a login por defecto evita caer en páginas intermedias cuando no hay sesión
  fallbackPath = '/login',
  strictPath,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { validPermissionsbyroute, user, hasExpired, hydrated /*, authLoading? */ } = useAuth();
  const { usePrincipalAlert } = usePrincipal();
  const { showAlert } = usePrincipalAlert;

  const routeToCheck = strictPath ?? pathname;

  // ---- Configurable: cuánto esperamos a que "llegue" el usuario
  const AUTH_GRACE_MS = 1200;
  const graceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Si tu contexto expone authLoading, úsalo aquí:
  // const authLoading = useAuthLoadingFromContext;
  // Para no romper, inferimos "loading" mientras el store no haya terminado de hidratarse
  const authLoading = !hydrated;

  const [checking, setChecking] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // 1) Manejar sesión expirada
  useEffect(() => {
    if (!hasExpired) return;
    showAlert({
      type: 'info',
      variant: 'subtle',
      title: 'Sesión caducada',
      description: 'El tiempo activo de tu sesión ha finalizado',
      autoCloseMs: 1200,
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
    const id = setTimeout(() => router.replace('/login'), 1200);
    return () => clearTimeout(id);
  }, [hasExpired, router, showAlert]);

  // 2) Resolver "authReady"
  useEffect(() => {
    // Si ya no carga, resolvemos de inmediato
    if (!authLoading) {
      setAuthReady(true);
      return;
    }
    // Si está cargando, damos una ventana de gracia
    if (!graceTimer.current) {
      graceTimer.current = setTimeout(() => {
        setAuthReady(true); // tras el grace, decide con lo que haya
      }, AUTH_GRACE_MS);
    }
    return () => {
      if (graceTimer.current) {
        clearTimeout(graceTimer.current);
        graceTimer.current = null;
      }
    };
  }, [authLoading]);

  // 3) Decidir login / permisos cuando auth está resuelto
  useEffect(() => {
    if (!authReady || hasExpired) return;

    // Si tras la gracia seguimos sin user → envía a login
    if (!user) {
      setHasPermission(false);
      setChecking(false);
      // Usa el router de Next para navegación consistente entre navegadores
      router.replace('/login');
      return;
    }

    // Con user presente, evaluar permisos
    const ok = validPermissionsbyroute(routeToCheck);
    setHasPermission(ok);
    setChecking(false);

    if (!ok) {
      router.replace(fallbackPath);
    }
  }, [authReady, user, routeToCheck, validPermissionsbyroute, router, fallbackPath, hasExpired]);

  // 4) UI de carga mientras esperamos auth o permisos
  if (hasExpired || checking || hasPermission === null || authLoading) {
    return (
      <div className={loadingContainer}>
        <Spinner size="giant" />
        <p className={spinnerLabel}>Cargando contenido...</p>
      </div>
    );
  }

  // 5) Mensaje específico si quieres mantenerlo para home
  if (!hasPermission && routeToCheck.includes('main-page/home')) {
    return <div className={notPermissions}>No tienes permisos para acceder a esta sección.</div>;
  }

  return <>{children}</>;
};
