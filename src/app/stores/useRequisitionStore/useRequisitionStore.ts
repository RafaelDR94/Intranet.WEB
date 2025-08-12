'use client'
import { createWithEqualityFn } from 'zustand/traditional'
import { devtools } from 'zustand/middleware'
import type { RequisitionsState } from './types'
import {
  fetchRequisitions,
  createRequisition,
  updateRequisition,
  deleteRequisition,
  updateExcelRequisition,
} from './utilities'

export const useRequisitionsStore = createWithEqualityFn<RequisitionsState>()(
  devtools((set, get) => ({
    requisitions: [],
    loading: false,
    creating: false,
    updating: false,
    removing: false,
    updatingExcel: false,

    successGet: false,
    successPost: false,
    successPut: false,
    successDelete: false,
    successUpdateExcel: false,
    error: undefined,
    warning: undefined,
    fetchRequisitions: (force = false) => fetchRequisitions(set, get, force),
    createRequisition: (payload) => createRequisition(set, get, payload),
    updateRequisition: (payload) => updateRequisition(set, get, payload),
    deleteRequisition: (id) => deleteRequisition(set, get, id),
    updateExcelRequisition: (excel) => updateExcelRequisition(set, get, excel),

    reset: () => set({
      requisitions: [],
      error: undefined,
      warning: undefined,
      successGet: false,
      successPost: false,
      successPut: false,
      successDelete: false,
      successUpdateExcel: false,
      loading: false, creating: false, updating: false, removing: false, updatingExcel: false,
    }),
    resetFlags: () => set({
      loading: false, creating: false, updating: false, removing: false, updatingExcel: false,
      warning: undefined,
      successGet: false, successPost: false, successPut: false, successDelete: false, successUpdateExcel: false,
      error: undefined,
    }),
  }))
)
