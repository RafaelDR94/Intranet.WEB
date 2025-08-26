'use client'
import { createWithEqualityFn } from 'zustand/traditional'
import { devtools } from 'zustand/middleware'
import type { BillingHistoryState } from './types'
import { fetchBillingHistory } from './utilities'

/**
 * Store global para gestionar el historial de facturación.
 */
export const useBillingHistoryStore = createWithEqualityFn<BillingHistoryState>()(
  devtools((set, get) => ({
    /** Lista de registros del historial */
    history: [],
    /** Indica petición en curso */
    loading: false,
    /** Mensaje de error si la petición falla */
    error: undefined,

    /** Obtiene historial desde el backend */
    fetchBillingHistory: (idEmployee,force = false) => fetchBillingHistory(set, get, idEmployee,force),
    /** Forza refetch sin considerar cache */
    forceFetchBillingHistory: async (idEmployee:string) => { await fetchBillingHistory(set, get, idEmployee,true) },

    /** Restablece el estado inicial */
    reset: () => set({ history: [], error: undefined, loading: false }),
  }))
)
