import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { PermissionRedirectProps } from '../types';

import { useAuth } from '@/app/context/AuthContext/AuthContext';

/**
 * Evaluates permissions and redirects to the first allowed route.
 * Returns authorization state and helper to go home.
 */
export const usePermissionRedirect = ({
  routes,
  homePath = '/main-page',
  permissionChecker,
  router: customRouter,
}: PermissionRedirectProps) => {
  const { validPermissionsbyroute } = useAuth();
  const router = useRouter();
  const check = permissionChecker ?? validPermissionsbyroute;
  const nav = customRouter ?? router;
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const target = routes.find((r) => check(r));
    if (target) {
      nav.replace(target);
    } else {
      setAuthorized(false);
    }
  }, [routes, check, nav]);

  const goHome = () => nav.push(homePath);

  return { authorized, goHome } as const;
};
