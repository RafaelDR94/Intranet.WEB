import type { PettyCashVoucherFull } from '@/app/mappings/billingPettyCash/BillingPettyCash.types';

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
  /** Current status for the voucher. */
  status?: string;
  /** RFC del emisor for quick reference. */
  rfcEmisor?: string;
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
};
