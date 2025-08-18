import { BillingImages, BillingPost, BillingPut,BillinReject } from '@/app/mappings/billingimages/billingimages.types'

// src/app/stores/useBillingImagesStore/types.ts
/**
 * Estado para el store de imágenes de facturas.
 */
export type BillingImagesState = {
  /** Lista de imágenes de facturas */
  billingImages: BillingImages[]
  /** Imagen obtenida por ID */
  billingImage?: BillingImages
  /** Flags de proceso */
  loading: boolean
  creating: boolean
  updating: boolean
  removing: boolean
  rejecting:boolean

  /** Flags de éxito por operación */
  successGet: boolean
  successGetById: boolean
  successPost: boolean
  successPut: boolean
  successDelete: boolean
  succesReject:boolean

  /** Mensaje de error general */
  error?: string
  /** Advertencias retornadas por API */
  warning?: string

  fetchBillingImages: (force?: boolean) => Promise<void> | void
  fetchBillingImageById: (id: string, force?: boolean) => Promise<BillingImages | null>
  createBillingImage: (payload: BillingPost) => Promise<BillingImages | null>
  updateBillingImage: (payload: BillingPut) => Promise<BillingImages | null>
  deleteBillingImage: (id: string) => Promise<boolean>
  rejectBillingImage :(payload: BillinReject) => Promise<BillingImages | null>
  reset: () => void
  resetFlags: () => void
}
export type Set = (
  partial: Partial<BillingImagesState> |
  ((s: BillingImagesState) => Partial<BillingImagesState>)
) => void
export type Get = () => BillingImagesState
