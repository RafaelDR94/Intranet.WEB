'use client'
import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { BillingRequisitionWithEmployeesState } from './types'
import { deleteBillingRequisitionWithEmployees, fetchBillingRequisitionsWithEmployees } from './utilities'

/**
 * Store global para requisiciones con datos de empleados.
 */
export const useBillingRequisitionWithEmployeesStore =
  createWithEqualityFn<BillingRequisitionWithEmployeesState>()(
    devtools((set, get) => ({
      requisitions: [],
      loading: false,
      removing: false,
      successGet: false,
      successDelete: false,
      error: undefined,
      warning: undefined,

      fetchRequisitionsWithEmployees: (startDate, endDate, force = false) =>
        fetchBillingRequisitionsWithEmployees(startDate, endDate, set, get, force),

      deleteRequisition: (id) => deleteBillingRequisitionWithEmployees(set, get, id),

      reset: () =>
        set({
          requisitions: [],
          loading: false,
          removing: false,
          successGet: false,
          successDelete: false,
          error: undefined,
          warning: undefined,
        }),

      resetFlags: () =>
        set({
          loading: false,
          removing: false,
          successGet: false,
          successDelete: false,
          error: undefined,
          warning: undefined,
        }),
    })),
  )
