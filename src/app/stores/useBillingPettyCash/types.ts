import {
  PettyCashFundData,
  PostPettyCashFund,
  PutPettyCashFund,
  PutCashOnHand,
  PettyCashVoucherData,
  PostPettyCashVoucher,
  PutPettyCashVoucher,
} from '@/app/mappings/billingPettyCash/BillingPettyCash.types';

/**
 * Estado para el store de caja chica.
 */
export type BillingPettyCashState = {
  /** Fondos de caja chica */
  pettyCashFunds: PettyCashFundData[];
  /** Vales de caja chica */
  pettyCashVouchers: PettyCashVoucherData[];
  /** Fondo por ID */
  pettyCashFund?: PettyCashFundData;
  /** Vale por ID */
  pettyCashVoucher?: PettyCashVoucherData;
  /** Flags de proceso */
  loading: boolean;
  creating: boolean;
  updating: boolean;
  removing: boolean;
  validating: boolean;
  rejecting: boolean;
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
  successDeleteVoucher: boolean;
  successRejectVoucher: boolean;
  successValidateVoucher: boolean;
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
  fetchPettyCashVoucherById: (id: string, force?: boolean) => Promise<PettyCashVoucherData | null>;
  createPettyCashVoucher: (payload: PostPettyCashVoucher) => Promise<PettyCashVoucherData | null>;
  updatePettyCashVoucher: (payload: PutPettyCashVoucher) => Promise<PettyCashVoucherData | null>;
  deletePettyCashVoucher: (id: string) => Promise<boolean>;
  rejectPettyCashVoucher: (id: string, comments?: string) => Promise<boolean>;
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
