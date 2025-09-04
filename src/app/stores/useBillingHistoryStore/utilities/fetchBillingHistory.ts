// src/app/stores/useBillingHistoryStore/utilities/fetchBillingHistory.ts
'use client'
import { BillingHistory as BillingHistoryUrl } from '@/app/configurations/Axios/urls'
import { BillingHistoryMap } from '@/app/mappings/billinghistory/billinghistory.mapper'
import type { HistoryRow } from '@/app/mappings/billinghistory/billinghistory.types'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import type { Set, Get } from '../types'
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
    console.log("res",res);
    const mapped: HistoryRow[] = BillingHistoryMap(res.data?.data ?? [])
    console.log("mapped",mapped);
    set({ history: mapped, loading: false })

  } catch (err) {
    const e = normalizeApiError(err)
    set({ error: e.message, loading: false })
  }
}
