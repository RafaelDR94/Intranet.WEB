'use client'
import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { BillingDocumentsState } from './types'
import {
  fetchBillingDocuments,
  fetchBillingDocumentById,
  createBillingDocument,
  updateBillingDocument,
  deleteBillingDocument,
  validateBillingDocument,
  validateBillingDocumentOperations,
  rejectBillingDocument,
  fetchSatBillingDocument,
  sendToSapBillingDocument,
  fetchBillingDocumentByIdRequisition,
  fetchBillingDocumentCategories,
  fetchBillingDocumentDescriptions
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
    billingCategories: [],
    billingDocumentDescription: [],
    /** Documento por ID */
    billingDocument: undefined,
    /** Flags de proceso */
    loading: false,
    loadigSat: false,
    creating: false,
    updating: false,
    removing: false,
    validating: false,
    rejecting: false,
    gettingDescriptions: false,
    gettingCategories: false,
    sending: false,
    /** Flags de éxito */
    successGet: false,
    successGetSat: false,
    successGetById: false,
    successPost: false,
    successPut: false,
    successDelete: false,
    succesValidate: false,
    succesReject: false,
    succesSend: false,
    succesDescriptions: false,
    succesCategories: false,
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
    /** Obtiene categorias de documentos */
    fetchBillingDocumentCategories: (force = false) => fetchBillingDocumentCategories(set, get, force),
    /** Obtiene categorias de documentos */
    fetchBillingDocumentDescriptions: (id, force = false) => fetchBillingDocumentDescriptions(id, set, get, force),
    /** Obtiene documento por ID */
    fetchBillingDocumentByIdRequisition: (id, force = false) => fetchBillingDocumentByIdRequisition(id, set, get, force),
    /** Crea un documento */
    createBillingDocument: (payload) => createBillingDocument(set, get, payload),
    /** Actualiza un documento */
    updateBillingDocument: (payload,idReq) => updateBillingDocument(set, get, payload,idReq),
    /** Elimina un documento */
    deleteBillingDocument: (id) => deleteBillingDocument(set, get, id),
    /** Valida un documento*/
    validateBillingDocument: (ids) => validateBillingDocument(set, get, ids),
    /** Valida un documento*/
    validateBillingDocumentOperations: (ids,idReq) => validateBillingDocumentOperations(set, get, ids,idReq),
    /**Envio de Documentos a SAP*/
    sendToSapBillingDocument: (ids) => sendToSapBillingDocument(set, get, ids),
    /** Rechaza un documento*/
    rejectBillingDocument: (payload,idReq) => rejectBillingDocument(set, get, payload,idReq),
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
      successGetSat: false,
      successGetById: false,
      successPost: false,
      successPut: false,
      successDelete: false,
      succesValidate: false,
      succesReject: false,
      validating: false,
      rejecting: false,
      loading: false,
      creating: false,
      updating: false,
      removing: false,
      gettingDescriptions: false,
      gettingCategories: false,
      succesDescriptions: false,
      succesCategories: false,
    }),
    /** Limpia solo los flags */
    resetFlags: () => set({
      loading: false, loadigSat: false, successGetSat: false, creating: false, updating: false, removing: false,
      warning: undefined,
      succesValidate: false,
      succesReject: false,
      validating: false,
      rejecting: false,
      gettingDescriptions: false,
      gettingCategories: false,
      successGet: false, successGetById: false, successPost: false, successPut: false, successDelete: false,
      error: undefined,
      succesDescriptions: false,
      succesCategories: false,
    }),
  }))
)
