// src/app/stores/useBillingDocumentsStore/utilities/deleteBillingDocument.ts
'use client'
import type { AxiosResponse } from 'axios'
import { BillingDocument as BillingDocumentUrl } from '@/app/configurations/Axios/urls'
import type { Set, Get } from '../types'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { pDelete } from '@/app/utilities/Http/promisifyIntranet'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'

/**
 * Elimina un documento de factura por ID.
 *
 * @param set Función `set`
 * @param get Función `get`
 * @param id identificador del documento
 */
export const deleteBillingDocument = async (
  set: Set,
  get: Get,
  id: string
): Promise<boolean> => {
  set({ removing: true, error: undefined, successDelete: false })

  try {
    const del = pDelete(requireGateway('del'), [200, 204])
    const _res: AxiosResponse = await del(`${BillingDocumentUrl}/${id}`)

    set((s) => ({
      billingDocuments: s.billingDocuments.filter((b) => b.billingdocument_id !== id),
      removing: false,
      successDelete: true,
    }))
    return true
  } catch (e) {
    set({ removing: false, successDelete: false, error: normalizeApiError(e).message })
    return false
  }
}
