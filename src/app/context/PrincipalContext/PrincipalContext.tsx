'use client';

/**
 * PrincipalContext – Contexto global para centralizar múltiples hooks compartidos.
 *
 * Este contexto reemplaza al antiguo ThemeContext, integrando el hook de tema
 * (`useTheme`) y, eventualmente, otros hooks globales como `useAuth`, `usePermissions`, etc.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { PrincipalContextValue } from './types';
import useTheme from './hooks/useTheme/useTheme';
import useAlert from './hooks/useAlert/useAlert';

const PrincipalContext = createContext<PrincipalContextValue | undefined>(undefined);

/**
 * Proveedor global del contexto.
 *
 * Envolverá la aplicación para exponer los hooks compartidos
 * (`useTheme`, `useAlert`, etc.) a toda la aplicación.
 */
export const PrincipalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const usePrincipalTheme = useTheme();
  const usePrincipalAlert = useAlert();

  const value: PrincipalContextValue = useMemo(() => ({
    usePrincipalTheme, usePrincipalAlert
  }), [usePrincipalAlert,usePrincipalTheme]);

  return (
    <PrincipalContext.Provider value={value}>
      {children}
    </PrincipalContext.Provider>
  );
};

/**
 * Hook para acceder a los valores del `PrincipalContext`.
 *
 * @returns Objeto con los hooks disponibles: `usePrincipalTheme` y `usePrincipalAlert`.
 */
export const usePrincipal = (): PrincipalContextValue => {
  const ctx = useContext(PrincipalContext);
  if (!ctx) throw new Error('usePrincipal debe usarse dentro de PrincipalProvider');
  return ctx;
};
