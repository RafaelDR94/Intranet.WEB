'use client'
import React, { ReactNode } from 'react'

import usePermissions from './hooks/usePermissions'

import { useAuthStore } from '@/app/stores/useAuthStore/useAuthStore'

/**
 * Proveedor de autenticación basado en store.
 * Actualmente solo renderiza los hijos ya que el estado es global.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => <>{children}</>

/**
 * Hook para acceder al estado y acciones de autenticación.
 * Combina el estado del store con los helpers de permisos.
 */
export const useAuth = () => {
  const state = useAuthStore()
  const {
    getRoutePermissions,
    validPermissionsbyroute,
    getCurrentPathPermissions,
    getCurrentPathAcces,
    currentPagePermissions,
  } = usePermissions({ user: state.user })
  return {
    ...state,
    getRoutePermissions,
    validPermissionsbyroute,
    getCurrentPathPermissions,
    getCurrentPathAcces,
    currentPagePermissions,
  }
}
