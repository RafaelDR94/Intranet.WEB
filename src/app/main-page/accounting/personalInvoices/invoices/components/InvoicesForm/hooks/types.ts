import { RefObject } from "react";

import { FieldModel } from "@/app/components/DynamicForm/types";
import { HistoryRow } from "@/app/mappings/billinghistory/billinghistory.types";
import { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types";
import { InvoiceSubmitResult } from "../../types";

/** Values returned by {@link useInvoicesForm}. */
export type UseInvoicesFormReturn = {
  /** Current field models. */
  fields: FieldModel[];
  /** Monotonic version used to force intentional form reinitialization only. */
  formVersion: number;
  /** Loading state while fetching options. */
  loadingFormInfo: boolean;
  /** External submit reference. */
  submitRef: RefObject<(() => void | Promise<void>) | null>;
  /** Form validity flag. */
  formReady: boolean;
  /** Setter for formReady. */
  setFormReady: (ready: boolean) => void;
  /** Submit handler. */
  handleSubmit: (values: Record<string, any>) => Promise<void>;
  /** Resets the form fields. */
  ResetForm: () => void;
  /** Displays an image in modal. */
  handleImageClick: (image: string) => void;
  /** Stores the latest form values for imperative submission. */
  handleValuesChange: (values: Record<string, any>) => void;
  /** Submits the provided values, or the latest captured values when omitted. */
  submitCurrentValues: (
    values?: Record<string, any> | null,
  ) => Promise<InvoiceSubmitResult>;
};

/** Options for {@link useInvoicesForm}. */
export interface UseInvoicesFormProps {
  /** Row to edit. */
  dataEdit?: HistoryRow | null;
  /** Existing billing images. */
  billingImages?: BillingImagesTable | null;
  /** Skip debtor name field. */
  withoutName?: boolean;
  /** Hide beneficiary and project fields when the requisition already provides that context. */
  hideBeneficiaryAndProject?: boolean;
  /** Optional unique form id for multi-instance rendering. */
  formId?: string;
  /** Callback when closing image preview. */
  onCloseImage?: () => void;
  /** Disable all fields. */
  disabled?: boolean;
  /** Optional requisition id to refresh requisition documents after updates. */
  refreshRequisitionId?: string;
  /** Optional callback fired after a successful submit/update. */
  onSubmitSuccess?: () => void;
}
