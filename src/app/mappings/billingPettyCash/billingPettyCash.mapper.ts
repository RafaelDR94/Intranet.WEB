import {
  PettyCashFundData,
  PettyCashVoucherData,
  PostPettyCashFund,
  PutPettyCashFund,
  PutCashOnHand,
  PostPettyCashVoucher,
  PutPettyCashVoucher,
  DeletePettyCashFund,
  DeletePettyCashVoucherId,
  PutPettyCashRejectId,
  PutPettyCashValidateId,
} from './BillingPettyCash.types';

/** Helpers */
const toString = (v: unknown, fallback = '') => (v == null ? fallback : String(v));
const toNumber = (v: unknown, fallback = 0) => {
  const num = Number(v);
  return isNaN(num) ? fallback : num;
};

/** Response maps */
export const PettyCashFundMap = (raw: any): PettyCashFundData => ({
  id: toString(raw?.id),
  year_month: toString(raw?.year_month),
  assigned_amount: toNumber(raw?.assigned_amount),
  verified_amount: toNumber(raw?.verified_amount),
  cash_on_hand: toNumber(raw?.cash_on_hand),
  unverified_amount: toNumber(raw?.unverified_amount),
  pending_verification: toNumber(raw?.pending_verification),
  available_amount: toNumber(raw?.available_amount),
});

export const PettyCashFundsMap = (list: any[]): PettyCashFundData[] =>
  Array.isArray(list) ? list.map(PettyCashFundMap) : [];

export const PettyCashVoucherMap = (raw: any): PettyCashVoucherData => ({
  id: toString(raw?.id),
  petty_cash_funds_id: toString(raw?.petty_cash_funds_id),
  employee_id: toString(raw?.employee_id),
  voucher_type: toString(raw?.voucher_type),
  application_date: toString(raw?.application_date),
  concept: toString(raw?.concept),
  amount: toNumber(raw?.amount),
  comments: toString(raw?.comments),
  project_id: toString(raw?.project_id),
  xml: toString(raw?.xml),
  pdf: toString(raw?.pdf),
});

export const PettyCashVouchersMap = (list: any[]): PettyCashVoucherData[] =>
  Array.isArray(list) ? list.map(PettyCashVoucherMap) : [];

/** Payload maps */
export const PostPettyCashFundMap = (src: any): PostPettyCashFund => ({
  year_month: toString(src?.year_month),
  assigned_amount: toNumber(src?.assigned_amount),
  verified_amount: toNumber(src?.verified_amount),
  cash_on_hand: toNumber(src?.cash_on_hand),
  unverified_amount: toNumber(src?.unverified_amount),
  pending_verification: toNumber(src?.pending_verification),
  available_amount: toNumber(src?.available_amount),
});

export const PutPettyCashFundMap = (src: any): PutPettyCashFund => ({
  id: toString(src?.id),
  year_month: toString(src?.year_month),
  assigned_amount: toNumber(src?.assigned_amount),
  verified_amount: toNumber(src?.verified_amount),
  cash_on_hand: toNumber(src?.cash_on_hand),
  unverified_amount: toNumber(src?.unverified_amount),
  pending_verification: toNumber(src?.pending_verification),
  available_amount: toNumber(src?.available_amount),
});

export const PutCashOnHandMap = (src: any): PutCashOnHand => ({
  id_petty_cash_found: toString(src?.id_petty_cash_found),
  cash_on_hand: toNumber(src?.cash_on_hand),
});

export const PostPettyCashVoucherMap = (src: any): PostPettyCashVoucher => ({
  petty_cash_funds_id: toString(src?.petty_cash_funds_id),
  employee_id: toString(src?.employee_id),
  voucher_type: toString(src?.voucher_type),
  application_date: toString(src?.application_date),
  concept: toString(src?.concept),
  amount: toNumber(src?.amount),
  comments: toString(src?.comments),
  project_id: toString(src?.project_id),
  xml: toString(src?.xml),
  pdf: toString(src?.pdf),
});

export const PutPettyCashVoucherMap = (src: any): PutPettyCashVoucher => ({
  id: toString(src?.id),
  petty_cash_funds_id: toString(src?.petty_cash_funds_id),
  employee_id: toString(src?.employee_id),
  voucher_type: toString(src?.voucher_type),
  application_date: toString(src?.application_date),
  concept: toString(src?.concept),
  amount: toNumber(src?.amount),
  comments: toString(src?.comments),
  project_id: toString(src?.project_id),
  xml: toString(src?.xml),
  pdf: toString(src?.pdf),
});

export const DeletePettyCashFundMap = (src: any): DeletePettyCashFund => ({
  id: toString(src?.id),
});

export const DeletePettyCashVoucherIdMap = (src: any): DeletePettyCashVoucherId => ({
  id: toString(src?.id),
});

export const PutPettyCashRejectIdMap = (src: any): PutPettyCashRejectId => ({
  id: toString(src?.id),
  comments: toString(src?.comments),
});

export const PutPettyCashValidateIdMap = (src: any): PutPettyCashValidateId => ({
  id: toString(src?.id),
});

