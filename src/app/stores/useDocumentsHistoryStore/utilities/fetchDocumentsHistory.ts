"use client"

import type { AxiosResponse } from "axios"

import type { Get, Set } from "../types"

import { BillingDocumentsHistory } from "@/app/configurations/Axios/urls"
import { DocumentsHistoryPageMap } from "@/app/mappings/documentshistory/documentshistory.mapper"
import type { DocumentsHistoryPage, DocumentsHistoryQuery } from "@/app/shared/documentshistory/types"
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError"
import { pGet } from "@/app/utilities/Http/promisifyIntranet"
import { requireGateway } from "@/app/utilities/Http/requireGateway"

import { buildDocumentsHistoryUrl } from "./serializeDocumentsHistoryQuery"

let latestListRequestId = 0

const createPendingPage = (
  query: DocumentsHistoryQuery,
): DocumentsHistoryPage => ({
  items: [],
  totalRows: 0,
  page: query.page,
  pageSize: query.pageSize,
})

export const fetchDocumentsHistory = async (
  set: Set,
  _get: Get,
  query: DocumentsHistoryQuery,
  _force = false,
): Promise<DocumentsHistoryPage | null> => {
  if (!BillingDocumentsHistory) {
    const pendingPage = createPendingPage(query)
    set({
      list: pendingPage.items,
      totalRows: pendingPage.totalRows,
      currentPage: pendingPage.page,
      pageSize: pendingPage.pageSize,
      query,
      loadingList: false,
      integrationPendingList: true,
      error: undefined,
    })
    return pendingPage
  }

  const requestId = ++latestListRequestId

  set({
    query,
    currentPage: query.page,
    pageSize: query.pageSize,
    loadingList: true,
    integrationPendingList: false,
    error: undefined,
  })

  try {
    const getFn = requireGateway("get")
    const getReq = pGet(getFn)
    const url = buildDocumentsHistoryUrl(BillingDocumentsHistory, query)
    const response: AxiosResponse = await getReq(url)
    const page = DocumentsHistoryPageMap(response.data?.data ?? response.data, query)

    if (requestId !== latestListRequestId) {
      return page
    }

    set({
      list: page.items,
      totalRows: page.totalRows,
      currentPage: page.page,
      pageSize: page.pageSize,
      query,
      loadingList: false,
      integrationPendingList: false,
      error: undefined,
    })

    return page
  } catch (error) {
    if (requestId !== latestListRequestId) {
      return null
    }

    const normalizedError = normalizeApiError(error)
    set({
      loadingList: false,
      integrationPendingList: false,
      error: normalizedError.message,
    })
    return null
  }
}
