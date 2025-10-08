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
  PutBillingsInvoiceReject,
  PettyCashVoucherFull,
  PettyCashVoucherProject,
  PettyCashVoucherConcept,
} from './BillingPettyCash.types';

/** Helpers */
const toString = (v: unknown, fallback = '') => (v == null ? fallback : String(v));
const toNumber = (v: unknown, fallback = 0) => {
  const num = Number(v);
  return isNaN(num) ? fallback : num;
};
const isObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object';

/** =========================
 *  Response maps - Funds
 *  ========================= */
export const PettyCashFundMap = (raw: any): PettyCashFundData => ({
  id: toString(raw?.id),
  year_month: toString(raw?.year_month),
  assigned_amount: toNumber(raw?.assigned_amount),
  verified_amount: toNumber(raw?.verified_amount),
  cash_on_hand: toNumber(raw?.cash_on_hand),
  unverified_amount: toNumber(raw?.unverified_amount),
  pending_verification: toNumber(raw?.pending_verification),
  available_amount: toNumber(raw?.available_amount),
  date_created: toString(raw?.date_created),
});

export const PettyCashFundsMap = (list: any[]): PettyCashFundData[] =>
  Array.isArray(list) ? list.map(PettyCashFundMap) : [];

/** =========================
 *  Response maps - Vouchers (ligero)
 *  Sigue siendo útil para POST/PUT y GET simples
 *  ========================= */
export const PettyCashVoucherMap = (raw: any): PettyCashVoucherData => ({
  id: toString(raw?.id),

  // Tolerante: si viene objeto nested, toma su id; si viene id simple, úsalo
  petty_cash_funds_id: toString(
    isObject(raw?.petty_cash_funds) ? raw?.petty_cash_funds?.id : raw?.petty_cash_funds_id
  ),
  employee_id: toString(raw?.employee_id),
  voucher_type: toString(raw?.voucher_type),
  application_date: toString(raw?.application_date),
  concept: toString(raw?.concept),
  amount: toString(raw?.amount),
  comments: toString(raw?.comments),

  // Tolerante con project anidado
  project_id: toString(isObject(raw?.project) ? raw?.project?.id : raw?.project_id),

  xml: toString(raw?.xml),
  pdf: toString(raw?.pdf),
  date_created: toString(raw?.date_created),
  fund_date_created: toString(
    raw?.fund_date_created ??
      raw?.petty_cash_funds?.date_created ??
      raw?.petty_cash_funds?.created_at ??
      raw?.petty_cash_funds?.dateCreated ??
      raw?.date_created_fund
  ),

  // Campos adicionales expuestos en algunas respuestas del endpoint general
  employeename: toString(raw?.employeename ?? raw?.employee_name),
  provider: toString(
    raw?.provider ??
      raw?.petty_cash_funds?.provider ??
      raw?.petty_cash_funds?.provider_name ??
      raw?.rfc_emisor
  ),
  uuid: toString(raw?.uuid),
  rfc_emisor: toString(raw?.rfc_emisor),
  rfc_receptor: toString(raw?.rfc_receptor),
  subtotal: toNumber(raw?.subtotal),
  iva: toNumber(raw?.iva),
  total: toNumber(raw?.total ?? raw?.amount),
  status: toString(raw?.status),
});

export const PettyCashVouchersMap = (list: any[]): PettyCashVoucherData[] =>
  Array.isArray(list) ? list.map(PettyCashVoucherMap) : [];

/** =========================
 *  Response maps - Vouchers (FULL enriquecido)
 *  Para GET con objetos anidados, totales y conceptos
 *  ========================= */
export const PettyCashVoucherProjectMap = (raw: any): PettyCashVoucherProject => ({
  id: toString(raw?.id),
  name: toString(raw?.name),
  proyectkey: toString(raw?.proyectkey),
  client: toString(raw?.client),
});

export const PettyCashVoucherConceptMap = (raw: any): PettyCashVoucherConcept => ({
  clave_sat: toString(raw?.clave_sat),
  clavesat_description: toString(raw?.clavesat_description),
  cantidad: toNumber(raw?.cantidad),
  valor_unitario: toNumber(raw?.valor_unitario),
  importe: toNumber(raw?.importe),
});

export const PettyCashVoucherFullMap = (raw: any): PettyCashVoucherFull => ({
  id: toString(raw?.id),
  petty_cash_funds: PettyCashFundMap(raw?.petty_cash_funds ?? {}),
  employee_id: toString(raw?.employee_id),
  status: toString(raw?.status),
  employeename: toString(raw?.employeename),
  voucher_type: toString(raw?.voucher_type),
  application_date: toString(raw?.application_date),
  concept: toString(raw?.concept),
  amount: toString(raw?.amount),
  comments: toString(raw?.comments),

  // Proyecto anidado
  project: PettyCashVoucherProjectMap(raw?.project ?? {}),

  xml: toString(raw?.xml),
  pdf: toString(raw?.pdf),

  // Campos extra del comprobante
  uuid: toString(raw?.uuid),
  rfc_emisor: toString(raw?.rfc_emisor),
  rfc_receptor: toString(raw?.rfc_receptor),
  subtotal: toNumber(raw?.subtotal),
  iva: toNumber(raw?.iva),
  total: toNumber(raw?.total),

  // Conceptos
  conceptos: Array.isArray(raw?.conceptos)
    ? raw.conceptos.map(PettyCashVoucherConceptMap)
    : [],
});

export const PettyCashVoucherFullsMap = (list: any[]): PettyCashVoucherFull[] =>
  Array.isArray(list) ? list.map(PettyCashVoucherFullMap) : [];

/** =========================
 *  Payload maps - Funds
 *  ========================= */
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

/** =========================
 *  Payload maps - Vouchers (ligero para POST/PUT)
 *  ========================= */
export const PostPettyCashVoucherMap = (src: any): PostPettyCashVoucher => ({
  petty_cash_funds_id: toString(src?.petty_cash_funds_id),
  employee_id: toString(src?.employee_id),
  voucher_type: toString(src?.voucher_type),
  application_date: toString(src?.application_date),
  concept: toString(src?.concept),
  amount: toString(src?.amount),
  comments: toString(src?.comments),
  project_id: toString(src?.project_id),
  xml: toString(src?.xml),
  pdf: toString(src?.pdf),
});

export const PutPettyCashVoucherMap = (src: any): PutPettyCashVoucher => {
  const payload: PutPettyCashVoucher = {
    id: toString(src?.id),
    petty_cash_funds_id: toString(src?.petty_cash_funds_id),
    employee_id: toString(src?.employee_id),
    voucher_type: toString(src?.voucher_type),
    application_date: toString(src?.application_date),
    concept: toString(src?.concept),
    amount: toString(src?.amount),
    comments: toString(src?.comments),
    project_id: toString(src?.project_id),
    xml: toString(src?.xml),
    pdf: toString(src?.pdf),
  };

  if (src?.total !== undefined && src?.total !== null) {
    payload.total = toNumber(src.total);
  }

  return payload;
};

/** =========================
 *  Otros payloads
 *  ========================= */
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

export const PutBillingsInvoiceRejectMap = (
  src: any,
): PutBillingsInvoiceReject => ({
  id: toString(src?.id),
  comments: toString(src?.comments),
});

// Mapea la respuesta del endpoint de historial por empleado
export const PettyCashVoucherByIdEmployeeMap = (raw: any): PettyCashVoucherFull[] => {
  // Soporta { data: [...] }, { items: [...] } o lista directa
  const payload = Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw?.items)
    ? raw.items
    : Array.isArray(raw)
    ? raw
    : [];
  return PettyCashVoucherFullsMap(payload);
};
