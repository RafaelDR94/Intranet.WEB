// src/app/stores/useBillingDocumentsStore/utilities/createBillingDocument.ts
'use client'
import type { AxiosResponse } from 'axios'

import type { Set, Get } from '../types'

import { fetchBillingDocumentByIdRequisition } from './fetchBillingDocumentByIdRequisition'
import { fetchBillingDocuments } from './fetchBillingDocuments'
import { fetchSatBillingDocument } from './fetchSatBillingDocument'

import { BillingRejectBillingDocument as BillingDocumentUrl } from '@/app/configurations/Axios/urls'
import type { BillingDocuments } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { BillingDocumentReject } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Crea un nuevo documento de factura en el backend.
 *
 * @param set Función `set` de Zustand
 * @param get Función `get`
 * @param payload Datos del documento a crear
 */
export const rejectBillingDocument = async (
  set: Set,
  get: Get,
  payload: BillingDocumentReject,
  reqid?: string
): Promise<BillingDocuments | null> => {
  set({ rejecting: true, error: undefined, succesReject: false })

  try {
    const put = pPut(requireGateway('put'), [200, 201])
    const res: AxiosResponse = await put(BillingDocumentUrl + "?id=" + payload.id + "&comment=" + payload.comment + "&type=" + payload.type, payload)
    const raw = res.data?.data
    const created = raw ? (raw as BillingDocuments) : null
    const statusLabel = payload.type ? 'Rechazado' : 'Restringido'
    const patchStatus = (list: BillingDocuments[]) =>
      list.map((doc) =>
        doc.billingdocument_id === payload.id ? { ...doc, status: statusLabel } : doc
      )

    // Actualiza de forma optimista el estatus en las listas actuales
    const current = get()
    set({
      billingDocuments: patchStatus(current.billingDocuments ?? []),
      billingDocumentnotToday: patchStatus(current.billingDocumentnotToday ?? []),
      billingDocumentsValid: patchStatus(current.billingDocumentsValid ?? []),
      billingDocumentsNotValid: patchStatus(current.billingDocumentsNotValid ?? []),
      billingDocumentsBadCode: patchStatus(current.billingDocumentsBadCode ?? []),
      billingDocumentsEfos: patchStatus(current.billingDocumentsEfos ?? []),
      billingDocument:
        current.billingDocument?.billingdocument_id === payload.id
          ? { ...current.billingDocument, status: statusLabel }
          : current.billingDocument,
    })

    if (reqid) fetchBillingDocumentByIdRequisition(reqid, set, get, true)
    else {
      fetchBillingDocuments(set, get, true);
      fetchSatBillingDocument(set, get, true);
    }

    set({ rejecting: false, succesReject: true, error: undefined })
    return created
  } catch (e) {
    set({ rejecting: false, succesReject: false, error: normalizeApiError(e).message })
    return null
  }
}
