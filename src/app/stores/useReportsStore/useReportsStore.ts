'use client'

import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { ReportsState } from './types'
import {
  fetchAllReports,
  fetchAllReportsByProyect,
  createReport,
  updateReport,
} from './utilities'

export const useReportsStore = createWithEqualityFn<ReportsState>()(
  devtools((set, get) => ({
    reports: [],
    currentReport: null,

    loading: false,
    creating: false,
    updating: false,

    successGet: false,
    successPost: false,
    successPut: false,

    error: undefined,

    fetchAllReports: async (force = false) => fetchAllReports(set, get, force),
    fetchAllReportsByProyect: async (idproyect: string, force = false) =>
    fetchAllReportsByProyect(idproyect, set, get, force),
    createReport: (payload) => createReport(set, get, payload),
    updateReport: (payload) => updateReport(set, get, payload),

    setCurrentReport: (r) => set({ currentReport: r ?? null }),
    clearCurrentReport: () => set({ currentReport: null }),

    reset: () => set({
      reports: [],
      currentReport: null,
      loading: false,
      creating: false,
      updating: false,
      successGet: false,
      successPost: false,
      successPut: false,
      error: undefined,
    }),

    resetFlags: () => set({
      loading: false,
      creating: false,
      updating: false,
      successGet: false,
      successPost: false,
      successPut: false,
      error: undefined,
    }),
  }))
)

