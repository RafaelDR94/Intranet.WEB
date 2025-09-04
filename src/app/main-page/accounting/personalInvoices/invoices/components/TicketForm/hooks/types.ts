import { FieldModel } from '@/app/components/DynamicForm/types';
import { RefObject } from 'react';
import { HistoryRow } from '@/app/mappings/billinghistory/billinghistory.types';

/** Values returned by {@link useTicketForm}. */
export type UseTicketFormReturn = {
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
};

/** Options for {@link useTicketForm}. */
export interface UseInvoicesFormProps {
  /** Row to edit. */
  dataEdit?: HistoryRow | null;
}
