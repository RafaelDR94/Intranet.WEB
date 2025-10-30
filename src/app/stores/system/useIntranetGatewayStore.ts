// src/stores/system/useIntranetGatewayStore.ts
'use client'
import { create } from 'zustand'

import { IntranetGetType, IntranetPostType, IntranetPutType, IntranetDeleteType } from '@/app/hooks/useIntranetCRUD/types'

/**
 * Estado global que expone las funciones CRUD del gateway de intranet
 * para ser usadas en cualquier parte de la aplicación.
 */
type GatewayState = {
  /** función GET proporcionada por el gateway */
  get?: IntranetGetType
  /** función POST del gateway */
  post?: IntranetPostType
  /** función PUT del gateway */
  put?: IntranetPutType
  /** función DELETE del gateway */
  del?: IntranetDeleteType
  /** indica si al menos la función GET está lista */
  isReady: boolean
  /** registra nuevas funciones CRUD en el estado */
  setCRUD: (fns: Partial<Omit<GatewayState, 'isReady' | 'setCRUD'>>) => void
}

/** Store para registrar las funciones CRUD del gateway de intranet */
export const useIntranetGatewayStore = create<GatewayState>((set) => ({
  get: undefined,
  post: undefined,
  put: undefined,
  del: undefined,
  isReady: false,
  setCRUD: (fns) => set((s) => ({ ...s, ...fns, isReady: Boolean(fns.get || s.get) })),
}))
