import type { CompleteProcessToSAPResponse } from '@/app/mappings/billingdocuments/billingdocuments.types'

export type BillingCompleteProcessToSAPState = {
  sending: boolean
  success: boolean
  error?: string
  response?: CompleteProcessToSAPResponse | null
  completeProcessToSAP: (ids: string[]) => Promise<CompleteProcessToSAPResponse | null>
  reset: () => void
  resetFlags: () => void
}

export type Set = (
  partial:
    | Partial<BillingCompleteProcessToSAPState>
    | ((state: BillingCompleteProcessToSAPState) => Partial<BillingCompleteProcessToSAPState>),
) => void

export type Get = () => BillingCompleteProcessToSAPState
