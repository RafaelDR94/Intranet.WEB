import { HistoryRow } from "@/app/mappings/billinghistory/billinghistory.types"
import { BillingImagesTable} from "@/app/mappings/billingimages/billingimages.types"
import { ResponsiveLayoutMatrix } from "@/app/components/DynamicForm/types"
export interface InvoicesFormProps {
  dataEdit?: HistoryRow | null
  responsiveLayoutMatrix: ResponsiveLayoutMatrix | undefined
  externalSubmitRef?: React.RefObject<(() => void | Promise<void>) | null>
  withoutName?: boolean
  billingImages?: BillingImagesTable | null;
  onCloseImage?: () => void;
}

