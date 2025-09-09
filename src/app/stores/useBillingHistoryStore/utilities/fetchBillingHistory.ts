// src/app/stores/useBillingHistoryStore/utilities/fetchBillingHistory.ts
'use client'
import type { Set, Get } from '../types'

import { BillingHistory as BillingHistoryUrl } from '@/app/configurations/Axios/urls'
import { BillingHistoryMap } from '@/app/mappings/billinghistory/billinghistory.mapper'
import type { HistoryRow } from '@/app/mappings/billinghistory/billinghistory.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
/**
 * Obtiene el historial de facturación del backend y actualiza el estado.
 *
 * @param set Función `set` de Zustand
 * @param get Función `get` de Zustand
 * @param force Ignora la cache local si es `true`
 */
export const fetchBillingHistory = async (set: Set, get: Get,idEmployee:string, force = false,) => {


  if (get().history.length > 0 && !force) return

  set({ loading: true, error: undefined })
  try {
    const getFn = requireGateway('get')
    const res = await pGet(getFn)(BillingHistoryUrl+"/"+idEmployee)
    const mapped: HistoryRow[] = BillingHistoryMap(res.data?.data ?? [])
    set({ history: mapped, loading: false })

  } catch (err) {
    const e = normalizeApiError(err)
    set({ error: e.message, loading: false })
  }
}
