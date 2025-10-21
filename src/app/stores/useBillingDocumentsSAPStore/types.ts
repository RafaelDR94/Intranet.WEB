import type { BillingDocumentFull } from '@/app/mappings/billingdocuments/billingdocuments.types'

export type BillingDocumentsSAPState = {
  billingDocumentsValid: BillingDocumentFull[]
  billingDocumentsNotValid: BillingDocumentFull[]
  billingDocumentsBadCode: BillingDocumentFull[]
  billingDocumentsEfos: BillingDocumentFull[]
  loading: boolean
  successGet: boolean
  error?: string
  fetchBillingDocumentsSAP: (force?: boolean) => Promise<void>
  reset: () => void
  resetFlags: () => void
}

export type Set = (
  partial:
    | Partial<BillingDocumentsSAPState>
    | ((state: BillingDocumentsSAPState) => Partial<BillingDocumentsSAPState>)
) => void

export type Get = () => BillingDocumentsSAPState
