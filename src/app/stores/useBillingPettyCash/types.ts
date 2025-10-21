import {
  PettyCashFundData,
  PostPettyCashFund,
  PutPettyCashFund,
  PutCashOnHand,
  PettyCashVoucherData,
  PostPettyCashVoucher,
  PutPettyCashVoucher,
  PettyCashVoucherFull,
  PutBillingsInvoiceReject,
  PettyCashVoucherHistoryAmountItem,
  PutPettyCashVoucherHistoryAmount,
} from '@/app/mappings/billingPettyCash/BillingPettyCash.types';

/**
 * Estado para el store de caja chica.
 */
export type BillingPettyCashState = {
  /** Fondos de caja chica */
  pettyCashFunds: PettyCashFundData[];
  /** Vales de caja chica */
  pettyCashVouchers: PettyCashVoucherData[];
  /** Vales completos de caja chica */
  vouchersFull: PettyCashVoucherFull[];
  /** Fondo por ID */
  pettyCashFund?: PettyCashFundData;
  /** Vale por ID */
  pettyCashVoucher?: PettyCashVoucherData;
  /** Vale completo obtenido por ID */
  pettyCashVoucherFull?: PettyCashVoucherFull;
  /** Historial de montos para el vale seleccionado */
  pettyCashVoucherAmountHistory: PettyCashVoucherHistoryAmountItem[];
  /** Identificador del vale del cual proviene el historial cargado */
  pettyCashVoucherAmountHistoryId?: string;
  /** Flags de proceso */
  loading: boolean;
  creating: boolean;
  updating: boolean;
  removing: boolean;
  validating: boolean;
  rejecting: boolean;
  /** Flag de carga del historial de montos */
  loadingAmountHistory: boolean;
  /** Flags de éxito */
  successGetFunds: boolean;
  successGetFund: boolean;
  successPostFund: boolean;
  successPutFund: boolean;
  successDeleteFund: boolean;
  successCashOnHand: boolean;
  successGetVouchers: boolean;
  successGetVoucher: boolean;
  successPostVoucher: boolean;
  successPutVoucher: boolean;
  successPutVoucherAmount: boolean;
  successDeleteVoucher: boolean;
  successRejectVoucher: boolean;
  successRejectInvoice: boolean;
  successValidateVoucher: boolean;
  successGetVoucherAmountHistory: boolean;
  /** Mensaje de error global */
  error?: string;
  /** Mensaje de advertencia */
  warning?: string;

  fetchPettyCashFunds: (force?: boolean) => Promise<void> | void;
  fetchPettyCashFundById: (id: string, force?: boolean) => Promise<PettyCashFundData | null>;
  createPettyCashFund: (payload: PostPettyCashFund) => Promise<PettyCashFundData | null>;
  updatePettyCashFund: (payload: PutPettyCashFund) => Promise<PettyCashFundData | null>;
  deletePettyCashFund: (id: string) => Promise<boolean>;
  updateCashOnHand: (payload: PutCashOnHand) => Promise<boolean>;
  fetchPettyCashVouchers: (force?: boolean) => Promise<void> | void;
  fetchPettyCashVoucherById: (id: string, force?: boolean) => Promise<PettyCashVoucherFull | null>;
  fetchPettyCashVouchersByIdEmployee: (idEmployee: string) => Promise<PettyCashVoucherFull[] | null>;
  fetchPettyCashVoucherAmountHistory: (
    id: string,
    force?: boolean,
  ) => Promise<PettyCashVoucherHistoryAmountItem[] | null>;
  createPettyCashVoucher: (payload: PostPettyCashVoucher) => Promise<PettyCashVoucherData | null>;
  updatePettyCashVoucher: (payload: PutPettyCashVoucher) => Promise<PettyCashVoucherData | null>;
  updatePettyCashVoucherAmount: (
    payload: PutPettyCashVoucherHistoryAmount,
  ) => Promise<boolean>;
  deletePettyCashVoucher: (id: string) => Promise<boolean>;
  rejectPettyCashVoucher: (id: string, comments?: string) => Promise<boolean>;
  rejectBillingInvoice: (payload: PutBillingsInvoiceReject) => Promise<boolean>;
  validatePettyCashVoucher: (id: string) => Promise<boolean>;
  reset: () => void;
  resetFlags: () => void;
};

export type Set = (
  partial:
    | Partial<BillingPettyCashState>
    | ((state: BillingPettyCashState) => Partial<BillingPettyCashState>)
) => void;

export type Get = () => BillingPettyCashState;
