import { RefObject } from 'react';

import { FieldModel } from '@/app/components/DynamicForm/types';
import { HistoryRow } from '@/app/mappings/billinghistory/billinghistory.types';
import { BillingImagesTable } from '@/app/mappings/billingimages/billingimages.types';

/** Values returned by {@link useInvoicesForm}. */
export type UseInvoicesFormReturn = {
  /** Current field models. */
  fields: FieldModel[];
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
};

/** Options for {@link useInvoicesForm}. */
export interface UseInvoicesFormProps {
  /** Row to edit. */
  dataEdit?: HistoryRow | null;
  /** Existing billing images. */
  billingImages?: BillingImagesTable | null;
  /** Skip debtor name field. */
  withoutName?: boolean;
  /** Callback when closing image preview. */
  onCloseImage?: () => void;
  /** Disable all fields. */
  disabled?: boolean;
}
