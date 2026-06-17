import { RefObject } from 'react';

import { FieldModel } from '@/app/components/DynamicForm/types';
import { HistoryRow } from '@/app/mappings/billinghistory/billinghistory.types';

/** Values returned by {@link useTicketForm}. */
export type UseTicketFormReturn = {
  /** Current field models. */
  fields: FieldModel[];
  /** Key to force form remounts when resetting. */
  formKey: number;
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
};

/** Options for {@link useTicketForm}. */
export interface UseInvoicesFormProps {
  /** Row to edit. */
  dataEdit?: HistoryRow | null;
  /** Disable all fields. */
  disabled?: boolean;
  /** Avoid preloading the ticket image when editing. */
  suppressInitialTicketImage?: boolean;
  /** Optional callback fired after a successful submit/update. */
  onSubmitSuccess?: () => void;
}
