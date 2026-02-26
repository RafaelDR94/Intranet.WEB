import type { LabelType } from "@/app/components/Label/types";
import type {
  PettyCashVoucherFull,
  PettyCashVoucherHistoryAmountItem,
} from '@/app/mappings/billingPettyCash/BillingPettyCash.types';

/**
 * Row shape used by the petty cash control table.
 */
export type ControlRow = {
  /** Unique identifier for the voucher. */
  id: string;
  /** Employee name associated with the voucher. */
  employeeName: string;
  /** Voucher application date. */
  applicationDate?: string;
  /** Provider or emitter of the voucher. */
  provider?: string;
  /** Voucher concept or description. */
  concept?: string;
  /** Subtotal amount of the voucher. */
  subtotal?: number;
  /** IVA amount of the voucher. */
  iva?: number;
  /** Total amount of the voucher. */
  total?: number;
  /** Voucher type label. */
  voucherType?: string;
  VoucherLabelType: LabelType;
  /** Current status for the voucher. */
  status?: string;
  /** RFC del emisor for quick reference. */
  rfcEmisor?: string;
  /** Amount */
  amount: string | number;
};

/** Props for the contextual action cell. */
export type ActionMenuCellProps = {
  /** Current row information. */
  row: ControlRow;
  /** Called when the view-detail option is selected. */
  onView: (row: ControlRow) => void;
  /** Called when the delete option is selected. */
  onDelete: (row: ControlRow) => void;
};

export type ControlDetail = PettyCashVoucherFull;

export type ControlSideMenuProps = {
  /** Controls whether the detail sidebar is visible. */
  panelOpen: boolean;
  /** Handler used to toggle the visibility of the detail sidebar. */
  setPanelOpen: (open: boolean) => void;
  /** Row currently selected in the table. */
  selected: ControlRow | null;
  /** Detail information loaded from the backend. */
  detail: ControlDetail | null;
  /** Indicates whether the detail information is still loading. */
  isDetailLoading: boolean;
  /** Formats dates to human readable strings. */
  formatDate: (date?: string) => string;
  /** Formats monetary values in MXN. */
  formatMoney: (value?: number) => string;
  /** Callback executed when the user validates a voucher. */
  onValidate?: (row: ControlRow | null) => void;
  /**
   * Callback executed when the user rejects a voucher.
   *
   * @param row Voucher selected for rejection.
   * @param comments Reason provided by the reviewer.
   */
  onReject?: (
    row: ControlRow | null,
    comments: string,
    options?: { skipSuccessAlert?: boolean },
  ) => Promise<boolean> | boolean | void;
  /**
   * Callback executed when the authorization evidence is rejected.
   */
  onRejectAuthorizationEvidence?: (
    row: ControlRow | null,
    comments: string,
  ) => Promise<boolean> | boolean | void;
  /**
   * Callback executed when the reviewer rejects the billing invoice associated with the voucher.
   */
  onRejectInvoice?: (
    row: ControlRow | null,
    comments: string,
  ) => Promise<boolean> | boolean | void;
  /** Indicates whether a validation action is currently executing. */
  isValidating?: boolean;
  /** Indicates whether a rejection action is currently executing. */
  isRejecting?: boolean;
  /** Indicates whether the sidebar should display the editing UI. */
  isEditingAmount?: boolean;
  /** Toggles the editing UI visibility. */
  onEditModeChange?: (isEditing: boolean) => void;
  /** Persists the updated amount for the selected voucher. */
  onSaveAmount?: (amount: number) => Promise<void> | void;
  /** Indicates whether an amount update is in progress. */
  isSavingAmount?: boolean;
  /** History of amount changes for the selected voucher. */
  amountHistory?: PettyCashVoucherHistoryAmountItem[];
  /** Indicates whether the history information is still loading. */
  isHistoryLoading?: boolean;
  /** Callback executed when the user wants to request a new authorization. */
  onRequestAuthorization?: (row: ControlRow | null) => void;
  /** Authorization request modal state. */
  authorizationRequestOpen?: boolean;
  /** Authorization request modal options. */
  authorizationRequestOptions?: Array<{ label: string; value: string }>;
  /** Selected authorizer id. */
  authorizationRequestSelected?: string;
  /** Error message for authorization request. */
  authorizationRequestError?: string | null;
  /** Indicates whether an authorization request is being sent. */
  isRequestingAuthorization?: boolean;
  /** Closes the authorization request modal. */
  onCancelAuthorizationRequest?: () => void;
  /** Confirms the authorization request. */
  onConfirmAuthorizationRequest?: () => void;
  /** Updates selected authorizer. */
  onAuthorizationRequestChange?: (value: string) => void;
};
