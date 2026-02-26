'use client'
import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { BillingDocumentsPendingByEmployee as BillingDocumentsPendingByEmployeeUrl } from '@/app/configurations/Axios/urls'
import { BillingDocumentsMap } from '@/app/mappings/billingdocuments/billingdocuments.mapper'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Obtiene las facturas pendientes por empleado.
 * @param idEmployee Identificador del empleado.
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param force Ignora cache local si es true.
 */
export const fetchBillingDocumentsPendingByEmployee = async (
  idEmployee: string,
  set: Set,
  get: Get,
  force = false,
) => {
  if (!idEmployee) return

  if (
    !force &&
    get().pendingBillingDocuments.length > 0 &&
    get().pendingDocumentsEmployeeId === idEmployee
  ) {
    return
  }

  set({
    loadingPendingDocuments: true,
    errorPendingDocuments: undefined,
    successGetPendingDocuments: false,
    pendingBillingDocuments: [],
    pendingDocumentsEmployeeId: idEmployee,
  })

  try {
    const getFn = requireGateway('get')
    const getReq = pGet(getFn)
    const res: AxiosResponse = await getReq(
      `${BillingDocumentsPendingByEmployeeUrl}/${idEmployee}`,
    )
    const payload = res.data?.data ?? res.data ?? []
    console.log("payload",payload.map((item: any) => ({...item,document:{...item?.document,requisition:{...item.requisition}}})));
    const mapped = BillingDocumentsMap(payload.map((item: any) => ({...item,document:{...item?.document,requisition:{...item.requisition}}})))
    set({
      pendingBillingDocuments: mapped,
      loadingPendingDocuments: false,
      successGetPendingDocuments: true,
    })
  } catch (e) {
    const err = normalizeApiError(e)
    set({
      errorPendingDocuments: err.message,
      loadingPendingDocuments: false,
      successGetPendingDocuments: false,
    })
  }
}
