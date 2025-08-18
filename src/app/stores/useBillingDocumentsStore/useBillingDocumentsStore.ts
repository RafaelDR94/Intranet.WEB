'use client'
import { createWithEqualityFn } from 'zustand/traditional'
import { devtools } from 'zustand/middleware'
import type { BillingDocumentsState } from './types'
import {
  fetchBillingDocuments,
  fetchBillingDocumentById,
  createBillingDocument,
  updateBillingDocument,
  deleteBillingDocument,
} from './utilities'

/**
 * Store global para la gestión de documentos de facturas.
 */
export const useBillingDocumentsStore = createWithEqualityFn<BillingDocumentsState>()(
  devtools((set, get) => ({
    /** Lista de documentos */
    billingDocuments: [],
    /** Documento por ID */
    billingDocument: undefined,
    /** Flags de proceso */
    loading: false,
    creating: false,
    updating: false,
    removing: false,

    /** Flags de éxito */
    successGet: false,
    successGetById: false,
    successPost: false,
    successPut: false,
    successDelete: false,
    /** Mensaje de error global */
    error: undefined,
    /** Mensaje de advertencia */
    warning: undefined,

    /** Obtiene documentos */
    fetchBillingDocuments: (force = false) => fetchBillingDocuments(set, get, force),
    /** Obtiene documento por ID */
    fetchBillingDocumentById: (id, force = false) => fetchBillingDocumentById(id, set, get, force),
    /** Crea un documento */
    createBillingDocument: (payload) => createBillingDocument(set, get, payload),
    /** Actualiza un documento */
    updateBillingDocument: (payload) => updateBillingDocument(set, get, payload),
    /** Elimina un documento */
    deleteBillingDocument: (id) => deleteBillingDocument(set, get, id),

    /** Resetea todo el estado */
    reset: () => set({
      billingDocuments: [],
      billingDocument: undefined,
      error: undefined,
      warning: undefined,
      successGet: false,
      successGetById: false,
      successPost: false,
      successPut: false,
      successDelete: false,
      loading: false, creating: false, updating: false, removing: false,
    }),
    /** Limpia solo los flags */
    resetFlags: () => set({
      loading: false, creating: false, updating: false, removing: false,
      warning: undefined,
      successGet: false, successGetById: false, successPost: false, successPut: false, successDelete: false,
      error: undefined,
    }),
  }))
)
