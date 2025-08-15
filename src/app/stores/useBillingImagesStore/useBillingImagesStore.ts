'use client'
import { createWithEqualityFn } from 'zustand/traditional'
import { devtools } from 'zustand/middleware'
import type { BillingImagesState } from './types'
import {
  fetchBillingImages,
  fetchBillingImageById,
  createBillingImage,
  updateBillingImage,
  deleteBillingImage,
} from './utilities'

/**
 * Store global para la gestión de imágenes de facturas.
 */
export const useBillingImagesStore = createWithEqualityFn<BillingImagesState>()(
  devtools((set, get) => ({
    /** Lista de imágenes */
    billingImages: [],
    /** Imagen por ID */
    billingImage: undefined,
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

    /** Obtiene imágenes */
    fetchBillingImages: (force = false) => fetchBillingImages(set, get, force),
    /** Obtiene imagen por ID */
    fetchBillingImageById: (id, force = false) => fetchBillingImageById(id, set, get, force),
    /** Crea una imagen */
    createBillingImage: (payload) => createBillingImage(set, get, payload),
    /** Actualiza una imagen */
    updateBillingImage: (payload) => updateBillingImage(set, get, payload),
    /** Elimina una imagen */
    deleteBillingImage: (id) => deleteBillingImage(set, get, id),

    /** Resetea todo el estado */
    reset: () => set({
      billingImages: [],
      billingImage: undefined,
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
