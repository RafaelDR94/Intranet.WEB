export type PettyCashFundData = {
  id: string;
  year_month: string;
  assigned_amount: number;
  verified_amount: number;
  cash_on_hand: number;
  unverified_amount: number;
  pending_verification: number;
  available_amount: number;
};

export type GetPettyCashFundById = {
  data: PettyCashFundData;
  success: boolean;
  error_Message: string;
  error_Code: number;
};

export type GetPettyCashFund = {
  data: PettyCashFundData[];
  success: boolean;
  error_Message: string;
  error_Code: number;
};

export type PostPettyCashFund = {
  year_month: string;
  assigned_amount: number;
  verified_amount: number;
  cash_on_hand: number;
  unverified_amount: number;
  pending_verification: number;
  available_amount: number;
};

export type PutPettyCashFund = {
  id: string;
  year_month: string;
  assigned_amount: number;
  verified_amount: number;
  cash_on_hand: number;
  unverified_amount: number;
  pending_verification: number;
  available_amount: number;
};

export type DeletePettyCashFund = {
  id: string;
};

export type PutCashOnHand = {
  id_petty_cash_found: string;
  cash_on_hand: number;
};
export type PettyCashVoucherData = {
  id: string;
  petty_cash_funds_id: string;
  employee_id: string;
  voucher_type: string;
  application_date: string;
  concept: string;
  amount: number;
  comments: string;
  project_id: string;
  xml: string;
  pdf: string;
};

export type GetPettyCashVoucherById = {
  data: PettyCashVoucherData;
  success: boolean;
  error_Message: string;
  error_Code: number;
};

export type GetPettyCashVoucher = {
  data: PettyCashVoucherData[];
  success: boolean;
  error_Message: string;
  error_Code: number;
};

export type PostPettyCashVoucher = {
  petty_cash_funds_id: string;
  employee_id: string;
  voucher_type: string;
  application_date: string;
  concept: string;
  amount: number;
  comments: string;
  project_id: string;
  xml: string;
  pdf: string;
};

export type PutPettyCashVoucher = PostPettyCashVoucher & {
  id: string;
};

export type DeletePettyCashVoucherId = {
  id: string;
};

export type PutPettyCashRejectId = {
  id: string;
  comments?: string;
};

export type PutPettyCashValidateId = {
  id: string;
};