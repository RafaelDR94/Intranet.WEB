export type PettyCashFundData = {
  id: string;
  year_month: string;
  assigned_amount: 30000;
  verified_amount: 0;
  cash_on_hand: 0;
  unverified_amount: 0;
  pending_verification: 0;
  available_amount: 30000;
};

export type GetPettyCashFundById = {
  data: PettyCashFundData;
  success: true;
  error_Message: string;
  error_Code: 0;
};

export type GetPettyCashFund = {
  data: PettyCashFundData;
  success: true;
  error_Message: string;
  error_Code: 0;
};

export type PostPettyCashFund = {
  year_month: string;
  assigned_amount: 0;
  verified_amount: 0;
  cash_on_hand: 0;
  unverified_amount: 0;
  pending_verification: 0;
  available_amount: 0;
}

export type PutPettyCashFund = {
  id: string;
  year_month: string;
  assigned_amount: 0;
  verified_amount: 0;
  cash_on_hand: 0;
  unverified_amount: 0;
  pending_verification: 0;
  available_amount: 0;
}

export type DeletePettyCashFund = {
    id: string;
}

export type PutCashOnHand = {
  id_petty_cash_found: string;
  cash_on_hand: 0;
}

export type GetPettyCashVoucherById = {

}

export type GetPettyCashVoucher = {
  data: [],
  success: true,
  error_Message: string,
  error_Code: 0
}

export type PostPettyCashVoucher = {
  petty_cash_funds_id: string;
  employee_id: string;
  voucher_type: string;
  application_date: string;
  concept: string;
  amount: 0;
  comments: string;
  project_id: string;
  xml: string;
  pdf: string;
}

export type PutPettyCashVoucher = {
  id: string;
  petty_cash_funds_id: string;
  employee_id: string;
  voucher_type: string;
  application_date: string;
  concept: string;
  amount: 0;
  comments: string;
  project_id: string;
  xml: string;
  pdf: string;
}

export type DeletePettyCashVoucherId = {
    id: string;
}


export type PutPettyCashRejectId = {
    id: string;
}

export type PutPettyCashValidateId = {
    id: string;
}