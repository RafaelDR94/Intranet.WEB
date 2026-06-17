"use client"

import { devtools } from "zustand/middleware"
import { createWithEqualityFn } from "zustand/traditional"

import type { DocumentsHistoryState } from "./types"
import {
  fetchDocumentHistoryDetail,
  fetchDocumentsHistory,
} from "./utilities"

export const useDocumentsHistoryStore =
  createWithEqualityFn<DocumentsHistoryState>()(
    devtools((set, get) => ({
      list: [],
      detailById: {},
      totalRows: 0,
      currentPage: 1,
      pageSize: 12,
      query: null,
      loadingList: false,
      loadingDetail: false,
      integrationPendingList: false,
      integrationPendingDetail: false,
      error: undefined,
      fetchDocumentsHistory: (query, force = false) =>
        fetchDocumentsHistory(set, get, query, force),
      fetchDocumentHistoryDetail: (id, scope, force = false) =>
        fetchDocumentHistoryDetail(id, scope, set, get, force),
      reset: () =>
        set({
          list: [],
          detailById: {},
          totalRows: 0,
          currentPage: 1,
          pageSize: 12,
          query: null,
          loadingList: false,
          loadingDetail: false,
          integrationPendingList: false,
          integrationPendingDetail: false,
          error: undefined,
        }),
    })),
  )
