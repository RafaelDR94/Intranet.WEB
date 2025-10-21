import type { CompleteProcessToSAPRequest } from '@/app/mappings/billingdocuments/billingdocuments.types'

export type BillingCompleteProcessToSAPState = {
  sending: boolean
  success: boolean
  error?: string
  response?: CompleteProcessToSAPRequest | null
  completeProcessToSAP: (ids: string[]) => Promise<CompleteProcessToSAPRequest | null>
  reset: () => void
  resetFlags: () => void
}

export type Set = (
  partial:
    | Partial<BillingCompleteProcessToSAPState>
    | ((state: BillingCompleteProcessToSAPState) => Partial<BillingCompleteProcessToSAPState>),
) => void

export type Get = () => BillingCompleteProcessToSAPState
