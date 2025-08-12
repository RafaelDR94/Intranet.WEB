// src/app/stores/useRequisitionStore/utilities/updateExcelRequisition.ts
'use client'
import type { AxiosResponse } from 'axios'
import { BillingRequisitionByExcel } from '@/app/configurations/Axios/urls'
import { RequisitionMap } from '@/app/mappings/requisitions/requisitions.mapp'
import type { Requisition } from '@/app/mappings/requisitions/requisitions.types'
import type { Set, Get } from '../types'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { fetchRequisitions } from './fetchRequisitions'

/**
 * Actualiza una requisición cargando un archivo de Excel.
 *
 * @param set función `set`
 * @param get función `get`
 * @param excel archivo de Excel con la información
 */
export const updateExcelRequisition = async (
    set: Set,
    get: Get,
    excel: File
): Promise<Requisition | null> => {
    set({ updatingExcel: true, error: undefined, successUpdateExcel: false })

    try {
        const formData = new FormData()
        formData.append('Excel', excel)

        const post = pPost(requireGateway('post')) // 200–299 OK por defecto
        const res: AxiosResponse = await post(`${BillingRequisitionByExcel}`, formData);
        const rowsWithMissingData = res.data.data.rowsWithMissingData;
        if(rowsWithMissingData && rowsWithMissingData.length > 0) {
        const warningmsg =
            Array.isArray(rowsWithMissingData) && rowsWithMissingData.length
                ? `Filas con datos faltantes:\n${rowsWithMissingData.map(s => `• ${s}`).join('\n')}`
                : 'No se detectaron filas con datos faltantes.';
            set({ warning: warningmsg })
        }
        const raw = res.data?.data
        const updated = raw ? RequisitionMap(raw) : undefined

        if (updated) {
            set((s) => ({
                requisitions: s.requisitions.map((r) =>
                    r.id_billingrequisition === updated.id_billingrequisition ? updated : r
                ),
                updatingExcel: false,
                successUpdateExcel: !(rowsWithMissingData && rowsWithMissingData.length > 0),
            }))
            return updated
        }

        // No vino el item → refetch
        await fetchRequisitions(set, get, true)
        set({ updatingExcel: false, successUpdateExcel: !(rowsWithMissingData && rowsWithMissingData.length > 0)})
        return null
    } catch (e) {
        set({
            updatingExcel: false,
            successUpdateExcel: false,
            error: normalizeApiError(e).message,
        })
        return null
    }
}
