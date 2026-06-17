"use client"

import type { AxiosResponse } from "axios"

import type { Get, Set } from "../types"

import { BillingDocumentsHistoryById } from "@/app/configurations/Axios/urls"
import { DocumentHistoryDetailMap } from "@/app/mappings/documentshistory/documentshistory.mapper"
import type {
  DocumentHistoryDetail,
  DocumentsHistoryScope,
} from "@/app/shared/documentshistory/types"
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError"
import { pGet } from "@/app/utilities/Http/promisifyIntranet"
import { requireGateway } from "@/app/utilities/Http/requireGateway"

import { buildDocumentsHistoryDetailUrl } from "./serializeDocumentsHistoryQuery"

let latestDetailRequestId = 0

export const fetchDocumentHistoryDetail = async (
  id: string,
  scope: DocumentsHistoryScope,
  set: Set,
  get: Get,
  force = false,
): Promise<DocumentHistoryDetail | null> => {
  if (!force && get().detailById[id]) {
    return get().detailById[id]
  }

  if (!BillingDocumentsHistoryById) {
    set({
      loadingDetail: false,
      integrationPendingDetail: true,
      error: undefined,
    })
    return null
  }

  const requestId = ++latestDetailRequestId

  set({
    loadingDetail: true,
    integrationPendingDetail: false,
    error: undefined,
  })

  try {
    const getFn = requireGateway("get")
    const getReq = pGet(getFn)
    const url = buildDocumentsHistoryDetailUrl(BillingDocumentsHistoryById, id)
    const response: AxiosResponse = await getReq(url)
    const detail = DocumentHistoryDetailMap(response.data?.data ?? response.data)

    if (requestId !== latestDetailRequestId) {
      return detail
    }

    if (!detail) {
      set({
        loadingDetail: false,
        integrationPendingDetail: false,
        error: "No se encontro el detalle de la factura.",
      })
      return null
    }

    set((previousState) => ({
      detailById: {
        ...previousState.detailById,
        [id]: detail,
      },
      loadingDetail: false,
      integrationPendingDetail: false,
      error: undefined,
    }))

    return detail
  } catch (error) {
    if (requestId !== latestDetailRequestId) {
      return null
    }

    const normalizedError = normalizeApiError(error)
    set({
      loadingDetail: false,
      integrationPendingDetail: false,
      error: normalizedError.message,
    })
    return null
  }
}
