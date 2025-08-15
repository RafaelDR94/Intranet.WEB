'use client'
import { createWithEqualityFn } from 'zustand/traditional'
import { devtools } from 'zustand/middleware'
import type { RequisitionsState } from './types'
import {
  fetchRequisitions,
  fetchRequisitionsByIdEmployee,
  fetchRequisitionsByDate,
  createRequisition,
  updateRequisition,
  deleteRequisition,
  updateExcelRequisition,
} from './utilities'

/**
 * Store global para la gestión de requisiciones.
 */
export const useRequisitionsStore = createWithEqualityFn<RequisitionsState>()(
  devtools((set, get) => ({
    /** Lista de requisiciones */
    requisitions: [],
    /** Flags de proceso */
    loading: false,
    creating: false,
    updating: false,
    removing: false,
    updatingExcel: false,

    /** Flags de éxito */
    successGet: false,
    successPost: false,
    successPut: false,
    successDelete: false,
    successUpdateExcel: false,
    /** Mensaje de error global */
    error: undefined,
    /** Mensaje de advertencia */
    warning: undefined,
    /** Obtiene requisiciones */
    fetchRequisitions: (force = false) => fetchRequisitions(set, get, force),
    /** Obtiene requisiciones */
    fetchRequisitionsByDate: (startDate, endDate, force = false) => fetchRequisitionsByDate(startDate, endDate, set, get, force),
    /** Obtiene requisiciones */
    fetchRequisitionsByIdEmployee: (idEmployee, force = false) => fetchRequisitionsByIdEmployee(idEmployee, set, get, force),
    /** Crea una requisición */
    createRequisition: (payload) => createRequisition(set, get, payload),
    /** Actualiza una requisición */
    updateRequisition: (payload) => updateRequisition(set, get, payload),
    /** Elimina una requisición */
    deleteRequisition: (id) => deleteRequisition(set, get, id),
    /** Actualiza vía Excel */
    updateExcelRequisition: (excel) => updateExcelRequisition(set, get, excel),

    /** Resetea todo el estado */
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
    /** Limpia solo los flags */
    resetFlags: () => set({
      loading: false, creating: false, updating: false, removing: false, updatingExcel: false,
      warning: undefined,
      successGet: false, successPost: false, successPut: false, successDelete: false, successUpdateExcel: false,
      error: undefined,
    }),
  }))
)
