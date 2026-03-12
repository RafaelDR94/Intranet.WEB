// src/app/stores/useRequisitionStore/utilities/fetchRequisitions.ts
'use client'
import type { AxiosResponse } from 'axios'

import { Get, Set } from '../types'

import { BillingRequisitionsByID } from '@/app/configurations/Axios/urls'
import { RequisitionMap } from '@/app/mappings/requisitions/requisitions.mapp'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Obtiene las requisiciones activas del backend y actualiza el estado.
 *
 * @param set Función `set` de Zustand
 * @param get Función `get` de Zustand
 * @param force Forza la recarga ignorando cache
 */
export const fetchCurrentRequisition = async (set: Set, get: Get, id: string, force = false) => {

    set({ gettincurrentReq: true, error: undefined, succesgetingCurrent: false })
    const localRequisition = get().requisitions.find((req) => (req.billingrequisition_id == id))
    if (localRequisition && !force) { set({ currentRequisition: localRequisition, gettincurrentReq: false, succesgetingCurrent: true }); return };

    try {
        // 1) Obtiene GET del gateway (lanza si no está listo)
        const GetFn = requireGateway('get')

        // 2) promisify con rango OK por defecto 200–299
        const getReq = pGet(GetFn)

        // 3) llamada
        const res: AxiosResponse = await getReq(`${BillingRequisitionsByID}/${id}`)
        // 4) mapear y guardar
 
        const raw = res.data?.data
        const mapped = Array.isArray(raw)
          ? raw.map((req: any) => RequisitionMap(req))
          : raw
            ? [RequisitionMap(raw)]
            : []

        set({ currentRequisition: mapped[0] ?? null, gettincurrentReq: false, succesgetingCurrent: true })
    } catch (e) {
        // 5) error normalizado
        const err = normalizeApiError(e)
        set({ error: err.message, gettincurrentReq: false, succesgetingCurrent: false })
    }
}
