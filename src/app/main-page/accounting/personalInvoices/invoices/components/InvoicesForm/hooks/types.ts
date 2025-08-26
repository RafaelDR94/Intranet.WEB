import { FieldModel } from '@/app/components/DynamicForm/types'
import { RefObject } from 'react'
import { HistoryRow } from '@/app/mappings/billinghistory/billinghistory.types'
import { BillingImagesTable } from '@/app/mappings/billingimages/billingimages.types'

export type UseInvoicesFormReturn = {
  fields: FieldModel[]
  loadingFormInfo: boolean
  submitRef: RefObject<(() => void | Promise<void>) | null>
  formReady: boolean
  setFormReady: (ready: boolean) => void
  handleSubmit: (values: Record<string, any>) => Promise<void>

}

export interface UseInvoicesFormProps {
  dataEdit?: HistoryRow | null
  billingImages?: BillingImagesTable | null
  withoutName?: boolean
  onCloseImage?: () => void;

}
