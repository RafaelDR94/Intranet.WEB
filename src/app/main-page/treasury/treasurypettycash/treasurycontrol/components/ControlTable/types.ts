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
