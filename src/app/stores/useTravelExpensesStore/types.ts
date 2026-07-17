import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";
import type { TravelExpenseCalculation } from "@/app/mappings/travelExpenseCalculations/travelExpenseCalculations.types";

/**
 * Payload used to reject a travel expense requisition.
 */
export type RejectTravelExpensePayload = {
  /** Travel expense requisition identifier. */
  idTravelExpense: string;
  /** Rejection reason. */
  comment: string;
};

/**
 * Payload used to create a travel expense requisition.
 */
export type CreateTravelExpensePayload = {
  /** Employee creating the request. */
  applicant_id: string;
  /** Main employee assigned to the travel expense. */
  employee_id: string;
  /** Additional employees assigned as companions. */
  companions: {
    /** Companion employee identifier. */
    employee_id: string;
    /** Companion full name. */
    full_name: string;
  }[];
  /** Project identifier. */
  project_id: string;
  /** Department identifier. */
  department_id: string;
  /** Enterprise identifier. */
  enterprise_id: string;
  /** Start date in ISO format. */
  assignmentdate: string;
  /** End date in ISO format. */
  enddate: string;
  /** State where the travel expense applies. */
  state: string;
  /** Request reason. */
  motive: string;
};

/**
 * Payload used to update a travel expense requisition.
 */
export type UpdateTravelExpensePayload = {
  /** Travel expense requisition identifier. */
  id: string;
  /** Assigned employee identifier. */
  employee_id: string;
  /** Additional employees assigned as companions. */
  companions?: SaveTravelExpenseProgressCompanionPayload[];
  /** Current calculation concepts. */
  calculation_concepts?: SaveTravelExpenseProgressCalculationConceptPayload[];
  /** Project identifier. */
  project_id: string;
  /** Department identifier. */
  department_id: string;
  /** Enterprise identifier. */
  enterprise_id: string;
  /** Start date in ISO format. */
  assignmentdate: string;
  /** End date in ISO format. */
  enddate: string;
  /** State where the travel expense applies. */
  state: string;
  /** Request reason. */
  motive: string;
  /** Assigned employee phone number. */
  phone_number?: string;
  /** Assigned employee card number. */
  card_number?: string;
};

/**
 * Payload used to save one travel expense calculation row.
 */
export type TravelExpenseCalculationPayload = {
  /** Existing calculation identifier. */
  id?: string;
  /** Requisition request identifier. */
  id_requisition_request: string;
  /** Employee identifier for per-beneficiary calculations. */
  employee_id?: string;
  /** Calculation concept. */
  concept: string;
  /** National quoted amount. */
  national_quoted: number;
  /** Foreign quoted amount. */
  foreign_quoted: number;
  /** Number of people. */
  people: number;
  /** Number of days. */
  days: number;
  /** Row subtotal. */
  subtotal: number;
  /** Free text observations. */
  observations: string;
};

/**
 * Companion payload used to save travel expense progress.
 */
export type SaveTravelExpenseProgressCompanionPayload = {
  /** Companion employee identifier. */
  employee_id: string;
  /** Companion full name. */
  full_name: string;
};

/**
 * Calculation concept payload used to save travel expense progress.
 */
export type SaveTravelExpenseProgressCalculationConceptPayload = {
  /** Calculation concept. */
  concept: string;
  /** National quoted amount. */
  national_quoted: number;
  /** Foreign quoted amount. */
  foreign_quoted: number;
  /** Number of people. */
  people_number: number;
  /** Number of days. */
  days_number: number;
  /** Row subtotal. */
  subtotal: number;
  /** Free text observations. */
  observations: string;
};

/**
 * Progress item payload used to save one beneficiary draft block.
 */
export type SaveTravelExpenseProgressItemPayload = {
  /** Beneficiary employee identifier. */
  employee_id: string;
  /** Beneficiary employee name. */
  employee_name: string;
  /** Requisition code captured for this beneficiary block. */
  requisition_code: string;
  /** Motive captured for this beneficiary block. */
  motive: string;
  /** Start date captured for this beneficiary block. */
  start_date: string;
  /** End date captured for this beneficiary block. */
  end_date: string;
  /** Child companions associated under this beneficiary block. */
  companions: SaveTravelExpenseProgressCompanionPayload[];
  /** Current viatics rows for this beneficiary block. */
  calculation_concepts: SaveTravelExpenseProgressCalculationConceptPayload[];
};

/**
 * Payload used to save travel expense progress.
 */
export type SaveTravelExpenseProgressPayload = {
  /** Travel expense identifier. */
  id_travel_expense: string;
  /** Progress items grouped by visible beneficiary block. */
  progress_items: SaveTravelExpenseProgressItemPayload[];
};

/**
 * Employee catalog row with phone and card number.
 */
export type TravelExpenseEmployeeWithCardNumber = {
  /** Employee identifier. */
  employee_id: string;
  /** Employee full name. */
  full_name: string;
  /** Employee phone number. */
  phone_number: string;
  /** Employee card number. */
  card_number: string;
};

/**
 * Zustand state for travel expense requisitions.
 */
export type TravelExpensesState = {
  /** Active travel expense requisitions. */
  travelExpenses: TravelExpense[];
  /** Current requisition request detail from Billings/RequisitionRequestById. */
  currentRequisitionRequest?: TravelExpense;
  /** Employee catalog with card number for travel expenses. */
  employeesWithCardNumber: TravelExpenseEmployeeWithCardNumber[];
  /** Travel expense calculation concepts catalog. */
  travelExpenseCalculationConcepts: string[];
  /** GET request flag. */
  loading: boolean;
  /** GET request-by-id flag. */
  loadingRequisitionRequestDetail: boolean;
  /** GET employees with card number flag. */
  loadingEmployeesWithCardNumber: boolean;
  /** GET calculation concepts flag. */
  loadingCalculationConcepts: boolean;
  /** Create request flag. */
  creating: boolean;
  /** Update request flag. */
  updating: boolean;
  /** Save progress request flag. */
  savingProgress: boolean;
  /** Approve request flag. */
  approving: boolean;
  /** Reject request flag. */
  rejecting: boolean;
  /** Cancel or resend request flag. */
  cancelingOrResending: boolean;
  /** Send requisition request to authorization flag. */
  sendingAuthorization: boolean;
  /** Travel expense calculations by requisition request id. */
  travelExpenseCalculationsByRequest: Record<
    string,
    TravelExpenseCalculation[]
  >;
  /** GET calculations flag. */
  loadingCalculations: boolean;
  /** Save calculations flag. */
  savingCalculations: boolean;
  /** Successful GET flag. */
  successGet: boolean;
  /** Successful GET employees with card number flag. */
  successGetEmployeesWithCardNumber: boolean;
  /** Successful GET calculation concepts flag. */
  successGetCalculationConcepts: boolean;
  /** Successful create flag. */
  successPost: boolean;
  /** Successful update flag. */
  successPut: boolean;
  /** Successful save progress flag. */
  successSaveProgress: boolean;
  /** Successful approve flag. */
  successApprove: boolean;
  /** Successful reject flag. */
  successReject: boolean;
  /** Successful cancel or resend flag. */
  successCancelOrResend: boolean;
  /** Successful send to authorization flag. */
  successSendAuthorization: boolean;
  /** Successful calculations save flag. */
  successSaveCalculations: boolean;
  /** Normalized error message from the API layer. */
  error?: string;
  /** Fetches travel expenses from Billings/TravelExpenses. */
  fetchTravelExpenses: (force?: boolean) => Promise<void> | void;
  /** Fetches requisition requests from Billings/RequisitionRequest. */
  fetchRequisitionRequests: (force?: boolean) => Promise<void> | void;
  /** Fetches one requisition request detail by id. */
  fetchRequisitionRequestById: (id: string) => Promise<TravelExpense | null>;
  /** Fetches employees with phone and card number for travel expenses. */
  fetchEmployeesWithCardNumber: (
    force?: boolean,
  ) => Promise<TravelExpenseEmployeeWithCardNumber[]>;
  /** Fetches travel expense calculation concepts catalog. */
  fetchTravelExpenseCalculationConcepts: (force?: boolean) => Promise<string[]>;
  /** Creates a travel expense requisition. */
  createTravelExpense: (
    payload: CreateTravelExpensePayload,
  ) => Promise<TravelExpense | null>;
  /** Updates a travel expense requisition. */
  updateTravelExpense: (
    payload: UpdateTravelExpensePayload,
  ) => Promise<TravelExpense | null>;
  /** Saves travel expense draft progress. */
  saveTravelExpenseProgress: (
    payload: SaveTravelExpenseProgressPayload,
  ) => Promise<TravelExpense | null>;
  /** Approves a travel expense requisition. */
  approveTravelExpense: (idTravelExpense: string) => Promise<boolean>;
  /** Approves a requisition request from accounting. */
  approveRequisitionRequestThroughAccounting: (
    idRequisitionRequest: string,
  ) => Promise<boolean>;
  /** Rejects a travel expense requisition. */
  rejectTravelExpense: (
    payload: RejectTravelExpensePayload,
  ) => Promise<boolean>;
  /** Cancels or resends a travel expense requisition. */
  cancelOrResendTravelExpense: (
    idTravelExpense: string,
    action?: "cancel" | "resend",
  ) => Promise<boolean>;
  /** Sends a requisition request to authorization. */
  sendRequisitionRequestAuthorization: (
    idRequisitionRequest: string,
  ) => Promise<boolean>;
  /** Sends a travel expense request to authorization. */
  sendTravelExpenseAuthorization: (
    idTravelExpense: string,
    idAuthorizer: string,
  ) => Promise<boolean>;
  /** Fetches travel expense calculation rows by requisition request id. */
  fetchTravelExpenseCalculations: (
    idRequisitionRequest: string,
  ) => Promise<TravelExpenseCalculation[]>;
  /** Creates or updates travel expense calculation rows. */
  saveTravelExpenseCalculations: (
    rows: TravelExpenseCalculationPayload[],
  ) => Promise<TravelExpenseCalculation[]>;
  /** Clears all state. */
  reset: () => void;
  /** Clears request flags. */
  resetFlags: () => void;
};

export type Set = (
  partial:
    | Partial<TravelExpensesState>
    | ((state: TravelExpensesState) => Partial<TravelExpensesState>),
) => void;

export type Get = () => TravelExpensesState;
