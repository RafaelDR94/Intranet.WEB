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
  validateBillingDocument,
  rejectBillingDocument,
  fetchSatBillingDocument,
  sendToSapBillingDocument
} from './utilities'

/**
 * Store global para la gestión de documentos de facturas.
 */
export const useBillingDocumentsStore = createWithEqualityFn<BillingDocumentsState>()(
  devtools((set, get) => ({
    /** Lista de documentos */
    billingDocuments: [],
    billingDocumentnotToday: [],
    billingDocumentsValid: [],
    billingDocumentsNotValid: [],
    billingDocumentsBadCode: [],
    billingDocumentsEfos: [],
    /** Documento por ID */
    billingDocument: undefined,
    /** Flags de proceso */
    loading: false,
    loadigSat:false,
    creating: false,
    updating: false,
    removing: false,
    validating: false,
    rejecting: false,
    sending:false,
    /** Flags de éxito */
    successGet: false,
    successGetSat:false,
    successGetById: false,
    successPost: false,
    successPut: false,
    successDelete: false,
    succesValidate: false,
    succesReject: false,
    succesSend:false,
    /** Mensaje de error global */
    error: undefined,
    /** Mensaje de advertencia */
    warning: undefined,

    /** Obtiene documentos */
    fetchBillingDocuments: (force = false) => fetchBillingDocuments(set, get, force),
    /**Obtiene documentos validados por el SAT */
    fetchSatBillingDocument: (force = false) => fetchSatBillingDocument(set, get, force),

    /** Obtiene documento por ID */
    fetchBillingDocumentById: (id, force = false) => fetchBillingDocumentById(id, set, get, force),
    /** Crea un documento */
    createBillingDocument: (payload) => createBillingDocument(set, get, payload),
    /** Actualiza un documento */
    updateBillingDocument: (payload) => updateBillingDocument(set, get, payload),
    /** Elimina un documento */
    deleteBillingDocument: (id) => deleteBillingDocument(set, get, id),
    /** Valida un documento*/
    validateBillingDocument: (ids) => validateBillingDocument(set, get, ids),
     /**Envio de Documentos a SAP*/
    sendToSapBillingDocument: (ids) => sendToSapBillingDocument(set, get, ids),
    /** Rechaza un documento*/
    rejectBillingDocument: (payload) => rejectBillingDocument(set, get, payload),
    /** Resetea todo el estado */
    reset: () => set({
      billingDocuments: [],
      billingDocumentnotToday: [],
      billingDocumentsValid: [],
      billingDocumentsNotValid: [],
      billingDocumentsBadCode: [],
      billingDocumentsEfos: [],
      billingDocument: undefined,
      error: undefined,
      warning: undefined,
      successGet: false,
      successGetSat:false,
      successGetById: false,
      successPost: false,
      successPut: false,
      successDelete: false,
      succesValidate: false,
      succesReject: false,
      validating: false,
      rejecting: false,
      loading: false, creating: false, updating: false, removing: false,
    }),
    /** Limpia solo los flags */
    resetFlags: () => set({
      loading: false, loadigSat:false,successGetSat:false,creating: false, updating: false, removing: false,
      warning: undefined,
      succesValidate: false,
      succesReject: false,
      validating: false,
      rejecting: false,
      successGet: false, successGetById: false, successPost: false, successPut: false, successDelete: false,
      error: undefined,
    }),
  }))
)
