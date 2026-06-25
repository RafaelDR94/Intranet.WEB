import type { ReactNode } from "react";

import { ResponsiveLayoutMatrix } from "@/app/components/DynamicForm/types";
import { HistoryRow } from "@/app/mappings/billinghistory/billinghistory.types";
import { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types";

export type InvoiceSubmitResult = { ok: true } | { ok: false; error: string };

/** Props for invoice and ticket forms. */
export interface InvoicesFormProps {
  /** Existing row when editing. */
  dataEdit?: HistoryRow | null;
  /** Layout matrix for DynamicForm. */
  responsiveLayoutMatrix: ResponsiveLayoutMatrix | undefined;
  /** External submit reference. */
  externalSubmitRef?: React.RefObject<(() => void | Promise<void>) | null>;
  /** Optional imperative submit handler that returns a typed result. */
  submitRequestRef?: React.RefObject<
    (() => Promise<InvoiceSubmitResult>) | null
  >;
  /** Hide debtor name field. */
  withoutName?: boolean;
  /** Optional unique form id for multi-instance rendering. */
  formId?: string;
  /** Optional billing images when editing ticket uploads. */
  billingImages?: BillingImagesTable | null;
  /** Callback when image preview is closed. */
  onCloseImage?: () => void;
  /** Disable all fields. */
  disabled?: boolean;
  /** Avoid preloading the ticket image when editing. */
  suppressInitialTicketImage?: boolean;
  /** Optional callback for DynamicForm validity changes. */
  onValidChange?: (isValid: boolean) => void;
  /** Optional requisition id to refresh requisition documents after updates. */
  refreshRequisitionId?: string;
  /** Optional className passed to the internal DynamicForm form element. */
  formClassName?: string;
  /** Optional className passed to each internal DynamicForm row. */
  rowClassName?: string;
  /** Optional title override for ticket form layouts. */
  layoutTitle?: string;
  /** Optional primary action label override for ticket form layouts. */
  layoutPrimaryLabel?: string;
  /** Optional upload field label override for ticket form layouts. */
  uploadFieldLabel?: string;
  /** Optional upload field placeholder override for ticket form layouts. */
  uploadFieldPlaceholder?: string;
  /** Optional upload field button label override for ticket form layouts. */
  uploadFieldButtonLabel?: string;
  /** Optional content rendered above the ticket form fields. */
  headerContent?: ReactNode;
  /** Render employee name as an inline readonly field inside the form. */
  showInlineEmployeeName?: boolean;
  /** Value displayed by the inline readonly employee field. */
  inlineEmployeeNameValue?: string;
  /** Optional callback fired after a successful submit/update. */
  onSubmitSuccess?: () => void;
}
