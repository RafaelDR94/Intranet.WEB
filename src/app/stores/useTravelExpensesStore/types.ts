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
  companion_ids: string[];
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
  companion_ids?: string[];
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
 * Zustand state for travel expense requisitions.
 */
export type TravelExpensesState = {
  /** Active travel expense requisitions. */
  travelExpenses: TravelExpense[];
  /** GET request flag. */
  loading: boolean;
  /** Create request flag. */
  creating: boolean;
  /** Update request flag. */
  updating: boolean;
  /** Approve request flag. */
  approving: boolean;
  /** Reject request flag. */
  rejecting: boolean;
  /** Cancel or resend request flag. */
  cancelingOrResending: boolean;
  /** Send requisition request to authorization flag. */
  sendingAuthorization: boolean;
  /** Travel expense calculations by requisition request id. */
  travelExpenseCalculationsByRequest: Record<string, TravelExpenseCalculation[]>;
  /** GET calculations flag. */
  loadingCalculations: boolean;
  /** Save calculations flag. */
  savingCalculations: boolean;
  /** Successful GET flag. */
  successGet: boolean;
  /** Successful create flag. */
  successPost: boolean;
  /** Successful update flag. */
  successPut: boolean;
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
  /** Creates a travel expense requisition. */
  createTravelExpense: (
    payload: CreateTravelExpensePayload,
  ) => Promise<TravelExpense | null>;
  /** Updates a travel expense requisition. */
  updateTravelExpense: (
    payload: UpdateTravelExpensePayload,
  ) => Promise<TravelExpense | null>;
  /** Approves a travel expense requisition. */
  approveTravelExpense: (idTravelExpense: string) => Promise<boolean>;
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
