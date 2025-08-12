// src/stores/system/useIntranetGatewayStore.ts
'use client'
import { create } from 'zustand'
import { IntranetGetType , IntranetPostType,IntranetPutType,IntranetDeleteType } from '@/app/hooks/useIntranetCRUD/types'

type GatewayState = {
  get?: IntranetGetType
  post?: IntranetPostType
  put?: IntranetPutType
  del?: IntranetDeleteType  
  isReady: boolean
  setCRUD: (fns: Partial<Omit<GatewayState, 'isReady' | 'setCRUD'>>) => void
}

export const useIntranetGatewayStore = create<GatewayState>((set) => ({
  get: undefined,
  post: undefined,
  put: undefined,
  del: undefined,
  isReady: false,
  setCRUD: (fns) => set((s) => ({ ...s, ...fns, isReady: Boolean(fns.get || s.get) })),
}))
