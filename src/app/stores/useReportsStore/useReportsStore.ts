'use client'

import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { ReportsState } from './types'
import {
  fetchAllReports,
  fetchAllReportsByProyect,
  createReport,
  updateReport,
  fetchReportsById,
  fetchReportTypes,
  fetchReportCategories,
  fetchLocalReports as fetchLocalReportsUtil,
  deleteLocalReport,
  deleteReport,
  fetchLocalReportById
} from './utilities'

export const useReportsStore = createWithEqualityFn<ReportsState>()(
  devtools((set, get) => ({
    reports: [],
    localReports: [],
    typesofReports: [],
    reportCategories: [],
    reportCategoriesTypeId: null,
    currentReport: null,

    loading: false,
    loadingCurrent: false,
    loadingTypes: false,
    loadingCategories: false,
    creating: false,
    updating: false,
    deleting: false,

    successGet: false,
    successPost: false,
    successPut: false,
    successDelete: false,
    succesCurrent: false,
    succesTypes: false,
    succesCategories: false,
    error: undefined,

    fetchAllReports: async (force = false) => fetchAllReports(set, get, force),
    fetchAllReportsByProyect: async (idproyect: string, force = false) =>
      fetchAllReportsByProyect(idproyect, set, get, force),
    fetchReportsById: async (idreport: string, force = false) =>
      fetchReportsById(idreport, set, get, force),
    fetchLocalReportById: async (idreport: string, force = false) =>
      fetchLocalReportById(idreport, set, get, force),
    fetchReportTypes: async (force = false) => fetchReportTypes(set, get, force),
    fetchReportCategories: async (idtype: string, force = false) =>
      fetchReportCategories(idtype, set, get, force),
    fetchLocalReports: async (force = false, idProyect?: string) => fetchLocalReportsUtil(set, get, force, idProyect),
    deleteLocal: async (frontId: string) => deleteLocalReport(set, get, frontId),
    deleteReport: async (id: string, proyectId?: string) => deleteReport(set, get, id, proyectId),
    createReport: (payload) => createReport(set, get, payload),
    updateReport: (payload) => updateReport(set, get, payload),

    setCurrentReport: (r) => set({ currentReport: r ?? null }),
    clearCurrentReport: () => set({ currentReport: null }),

    reset: () => set({
      reports: [],
      localReports: [],
      typesofReports: [],
      reportCategories: [],
      reportCategoriesTypeId: null,
      currentReport: null,
      loading: false,
      loadingCurrent: false,
      loadingTypes: false,
      loadingCategories: false,
      creating: false,
      updating: false,
      deleting: false,
      successGet: false,
      successPost: false,
      successPut: false,
      successDelete: false,
      succesCurrent: false,
      succesTypes: false,
      succesCategories: false,
      error: undefined,
    }),

    resetFlags: () => set({
      loading: false,
      loadingCurrent: false,
      loadingTypes: false,
      loadingCategories: false,
      creating: false,
      updating: false,
      deleting: false,
      successGet: false,
      successPost: false,
      successPut: false,
      successDelete: false,
      succesCurrent: false,
      succesTypes: false,
      succesCategories: false,
      error: undefined,
    }),

    resetCurrentReport: () => set({
      currentReport: null
    }),
  }))
)




