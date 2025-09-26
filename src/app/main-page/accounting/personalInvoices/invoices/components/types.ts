import { ResponsiveLayoutMatrix } from "@/app/components/DynamicForm/types";
import { HistoryRow } from "@/app/mappings/billinghistory/billinghistory.types";
import { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types";

/** Props for invoice and ticket forms. */
export interface InvoicesFormProps {
  /** Existing row when editing. */
  dataEdit?: HistoryRow | null;
  /** Layout matrix for DynamicForm. */
  responsiveLayoutMatrix: ResponsiveLayoutMatrix | undefined;
  /** External submit reference. */
  externalSubmitRef?: React.RefObject<(() => void | Promise<void>) | null>;
  /** Hide debtor name field. */
  withoutName?: boolean;
  /** Optional billing images when editing ticket uploads. */
  billingImages?: BillingImagesTable | null;
  /** Callback when image preview is closed. */
  onCloseImage?: () => void;
}

