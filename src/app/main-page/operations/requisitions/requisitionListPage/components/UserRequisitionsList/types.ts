import type { RequisitionRow } from "@/app/main-page/accounting/requisitions/requisitionsList/componentes/RequisitionsTable/types";

export type UserRequisitionsListProps = {
  /**
   * Forces the table to render even if the `id` param is missing.
   * Useful for tests or embedded views.
   */
  forceVisible?: boolean;
  /** Employee identifier to fetch requisitions for. */
  userId?: string | null;
  /** Optional callback to open the files view for a concrete requisition. */
  onViewFiles?: (row: RequisitionRow) => void;
};
