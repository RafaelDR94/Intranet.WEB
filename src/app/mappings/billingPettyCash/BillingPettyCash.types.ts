// ---- Fondos de Caja Chica ----
export type PettyCashFundData = {
  id: string;
  year_month: string;
  assigned_amount: number;
  verified_amount: number;
  cash_on_hand: number;
  unverified_amount: number;
  pending_verification: number;
  available_amount: number;
  date_created?: string;
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

// ---- Vales de Caja Chica (versión ligera para POST/PUT) ----
export type PettyCashVoucherData = {
  id: string;
  petty_cash_funds_id: string;
  employee_id: string;
  voucher_type: string;
  application_date: string;
  concept: string;
  comments: string;
  project_id: string;
  xml: string;
  pdf: string;
  authorization_evidence?: string;
  date_created?: string;
  fund_date_created?: string;
  /** Nombre del colaborador asociado al vale (si está disponible). */
  employeename?: string;
  /** Identificador del proveedor o emisor de la factura. */
  provider?: string;
  /** UUID del comprobante si el API lo expone en la respuesta ligera. */
  uuid?: string;
  /** RFC del emisor del comprobante. */
  rfc_emisor?: string;
  /** RFC del receptor del comprobante. */
  rfc_receptor?: string;
  /** Subtotal del comprobante. */
  subtotal?: number;
  /** IVA del comprobante. */
  iva?: number;
  /** Total del comprobante. */
  total?: number;
  /** Estatus del vale (pendiente, válido, rechazado, etc.). */
  status?: string;
  amount?: string | number;
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
  amount: string;
  comments: string;
  project_id: string;
  xml: string;
  pdf: string;
  authorization_evidence: string;
};

export type PutPettyCashVoucher = PostPettyCashVoucher & {
  id: string;
  /** Total amount requested for the voucher. */
  total?: number;
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

export type PutPettyCashRejectAuthorizationEvidence = {
  id: string;
  comment: string;
};

export type PutBillingsInvoiceReject = {
  id: string;
  comments: string;
};

// ---- Detalles para la respuesta enriquecida de Vales (GET) ----
export type PettyCashVoucherConcept = {
  clave_sat: string;
  clavesat_description: string;
  cantidad: number;
  valor_unitario: number;
  importe: number;
};

export type PettyCashVoucherProject = {
  id: string;
  name: string;
  proyectkey: string;
  client: string;
};

// Reutiliza PettyCashFundData
export type PettyCashVoucherFund = PettyCashFundData;

export type PettyCashVoucherFull = {
  id: string;
  petty_cash_funds: PettyCashVoucherFund;
  employee_id: string;
  employeename: string;
  status: string;
  voucher_type: string;
  application_date: string;
  concept: string;
  amount: string;
  comments: string;
  project: PettyCashVoucherProject;
  xml: string;
  pdf: string;
  authorization_evidence: string;
  uuid: string;
  rfc_emisor: string;
  rfc_receptor: string;
  subtotal: number;
  iva: number;
  total: number;
  conceptos: PettyCashVoucherConcept[];
  isauthorization_evidence_rejected: boolean;
};

export type GetPettyCashVoucherFullById = {
  data: PettyCashVoucherFull;
  success: boolean;
  error_Message: string;
  error_Code: number;
};

export type GetPettyCashVoucherFull = {
  data: PettyCashVoucherFull[];
  success: boolean;
  error_Message: string;
  error_Code: number;
};

// ---- Historial de vales por empleado (GET /Billings/PettyCashVoucher/ByIdEmployee/{idEmployee}) ----
export type GetPettyCashVoucherByIdEmployeeParams = {
  idEmployee: string; // UUID del empleado
};

export type GetPettyCashVoucherByIdEmployee = {
  data: PettyCashVoucherFull[]; // lista de vales (respuesta FULL)
  success: boolean;
  error_Message: string;
  error_Code: number;
};

export type PettyCashVoucherHistoryAmountItem = {
  date: string;
  amount: number;
};

export type GetPettyCashVoucherHistoryAmountById = {
  data: PettyCashVoucherHistoryAmountItem[];
  success: boolean;
  error_Message: string;
  error_Code: number;
};

export type PutPettyCashVoucherHistoryAmount = {
  id: string;
  date: string;
  amount: number;
};