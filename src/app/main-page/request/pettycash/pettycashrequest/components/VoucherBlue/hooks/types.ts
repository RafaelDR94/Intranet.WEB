import { Dispatch, RefObject, SetStateAction } from 'react';

import { FieldModel } from '@/app/components/DynamicForm/types';
import type { SelectOption } from '@/app/components/Select/types';
import { SubmitFn } from '@/app/main-page/accounting/requisitions/requisitions/components/ExcelLoader/hooks/types';
import { PettyCashVoucherData } from '@/app/mappings/billingPettyCash/BillingPettyCash.types';

/** Mode for voucher forms. */
export type Mode = 'create' | 'edit';

/** Options for {@link useVoucherPink} and {@link useVoucherBlue}. */
export interface UseVoucherFormProps {
  /** Current form mode. */
  mode: Mode;
  /** Datos existentes para edición */
  dataEdit?: PettyCashVoucherData;
  /** Start with form disabled. */
  startDisabled?: boolean;
  /** Campos que deben mantenerse bloqueados aunque el formulario se habilite. */
  readOnlyFieldNames?: string[];
}

/** Values returned by voucher form hooks. */
export type UseVoucherFormReturn = {
  /** Current field models. */
  fields: FieldModel[];
  /** Loading state while initializing fields. */
  loadingFormInfo: boolean;
  /** Indicates whether form is ready to submit. */
  formReady: boolean;
  /** Setter for formReady. */
  setFormReady: (ready: boolean) => void;
  /** External submit reference. */
  submitRef: RefObject<SubmitFn | null>;
  /** Submit handler. */
  handleSubmit: (values: Record<string, unknown>) => Promise<void>;
  /** Triggers submitRef. */
  onSubmit: () => void;
  /** Disable primary button flag. */
  buttonDisabled: boolean;
  /** Permissions of current page. */
  currentPagePermissions: Record<string, boolean> | undefined;
  /** Form disabled state. */
  disableForm: boolean | undefined;
  /** Setter for disableForm. */
  setDisableForm: Dispatch<SetStateAction<boolean | undefined>>;
  /** Opciones de autorizadores (cuando aplica). */
  authorizerOptions?: SelectOption[];
  /** Autorizador seleccionado (cuando aplica). */
  authorizerSelected?: string;
  /** Setter del autorizador seleccionado (cuando aplica). */
  setAuthorizerSelected?: (value: string) => void;
  /** Indica si el popup de autorizador estó¡ abierto. */
  authorizerPopUpOpen?: boolean;
  /** Setter del popup de autorizador. */
  setAuthorizerPopUpOpen?: (value: boolean) => void;
  /** Error del autorizador. */
  authorizerError?: string | null;
  /** Confirmar autorizador. */
  handleAuthorizerConfirm?: () => void;
  /** Cancelar autorizador. */
  handleAuthorizerCancel?: () => void;
};
