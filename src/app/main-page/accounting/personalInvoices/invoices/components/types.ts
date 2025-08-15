import { HistoryRow } from "@/app/mappings/billinghistory/billinghistory.types"

  
export interface InvoicesFormProps {
  dataEdit?: HistoryRow | null
  layoutMatrix: number[][] | undefined
  externalSubmitRef?: React.RefObject<(() => void | Promise<void>) | null>
}

