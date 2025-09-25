import { MutableRefObject } from 'react';

import { ResponsiveLayoutMatrix } from '@/app/components/DynamicForm/types';
import { PettyCashVoucherData } from '@/app/mappings/billingPettyCash/BillingPettyCash.types';

/** Props for petty cash voucher forms. */
export interface VoucherFormProps {
  /** Define si el formulario se usa para crear o editar */
  mode?: 'create' | 'edit';
  /** Datos para edición del vale */
  dataEdit?: PettyCashVoucherData;
  /** Permite controlar el submit desde un contenedor externo */
  externalSubmitRef?: MutableRefObject<(() => void | Promise<void>) | null>;
  /** Para cerrar panel/modal si lo usas embebido */
  onClose?: () => void;
  /** Para controlar la distribucion */
  responsiveLayoutMatrix?: ResponsiveLayoutMatrix | undefined;
  /** Inicia con el componente deshabilitado */
  startDisabled?: boolean;
  /** Habilita la tabla colapsable */
  enableCollaps?: boolean;
  /** Inicia la tabla colapsada */
  startCollaps?: boolean;
}
