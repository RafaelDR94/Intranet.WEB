'use client'
import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { BillingRequisitionWithEmployeesState } from './types'
import {
  deleteBillingRequisitionWithEmployees,
  fetchBillingDocumentsPendingByEmployee,
  fetchBillingImagesPendingByEmployee,
  fetchBillingRequisitionsWithEmployees,
} from './utilities'

/**
 * Store global para requisiciones con datos de empleados.
 */
export const useBillingRequisitionWithEmployeesStore =
  createWithEqualityFn<BillingRequisitionWithEmployeesState>()(
    devtools((set, get) => ({
      requisitions: [],
      pendingBillingImages: [],
      pendingBillingDocuments: [],
      pendingImagesEmployeeId: undefined,
      pendingDocumentsEmployeeId: undefined,
      loading: false,
      removing: false,
      loadingPendingImages: false,
      loadingPendingDocuments: false,
      successGet: false,
      successDelete: false,
      successGetPendingImages: false,
      successGetPendingDocuments: false,
      error: undefined,
      warning: undefined,
      errorPendingImages: undefined,
      errorPendingDocuments: undefined,

      fetchRequisitionsWithEmployees: (startDate, endDate, force = false) =>
        fetchBillingRequisitionsWithEmployees(startDate, endDate, set, get, force),

      fetchBillingImagesPendingByEmployee: (idEmployee, force = false) =>
        fetchBillingImagesPendingByEmployee(idEmployee, set, get, force),

      fetchBillingDocumentsPendingByEmployee: (idEmployee, force = false) =>
        fetchBillingDocumentsPendingByEmployee(idEmployee, set, get, force),

      deleteRequisition: (id) => deleteBillingRequisitionWithEmployees(set, get, id),

      reset: () =>
        set({
          requisitions: [],
          pendingBillingImages: [],
          pendingBillingDocuments: [],
          pendingImagesEmployeeId: undefined,
          pendingDocumentsEmployeeId: undefined,
          loading: false,
          removing: false,
          loadingPendingImages: false,
          loadingPendingDocuments: false,
          successGet: false,
          successDelete: false,
          successGetPendingImages: false,
          successGetPendingDocuments: false,
          error: undefined,
          warning: undefined,
          errorPendingImages: undefined,
          errorPendingDocuments: undefined,
        }),

      resetFlags: () =>
        set({
          loading: false,
          removing: false,
          loadingPendingImages: false,
          loadingPendingDocuments: false,
          successGet: false,
          successDelete: false,
          successGetPendingImages: false,
          successGetPendingDocuments: false,
          error: undefined,
          warning: undefined,
          errorPendingImages: undefined,
          errorPendingDocuments: undefined,
        }),
    })),
  )
