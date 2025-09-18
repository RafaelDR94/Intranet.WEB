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
  amount: number;
  comments: string;
  project_id: string;
  xml: string;
  pdf: string;
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
  voucher_type: string;
  application_date: string;
  concept: string;
  amount: number;
  comments: string;
  project: PettyCashVoucherProject;
  xml: string;
  pdf: string;
  uuid: string;
  rfc_emisor: string;
  rfc_receptor: string;
  subtotal: number;
  iva: number;
  total: number;
  conceptos: PettyCashVoucherConcept[];
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
