import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";

/**
 * Props for the travel expense request table.
 */
export type TravelExpenseTableSectionProps = {
  rows: TravelExpense[];
  showStatus?: boolean;
  pagination?: boolean;
  onRefresh: () => void;
  onViewDetails: (row: TravelExpense) => void;
};

/**
 * Minimal beneficiary data shown inside requisition sections.
 */
export type TravelExpenseBeneficiary = {
  id: string;
  name: string;
  phone: string;
  cardNumber: string;
};

/**
 * Local UI-only companion association map keyed by parent beneficiary id.
 */
export type BeneficiaryAssociationMap = Record<string, string[]>;

/**
 * Editable requisition information per beneficiary block.
 */
export type RequisitionProgressValues = {
  requisitionCode: string;
  motive: string;
  startDate: string;
  endDate: string;
};

/**
 * UI state keyed by beneficiary id for independent requisition fields.
 */
export type RequisitionProgressValuesByBeneficiary = Record<
  string,
  RequisitionProgressValues
>;

/**
 * Available tabs in the requisition draft detail.
 */
export type RequisitionSection = "information" | "viatics";

/**
 * Normalized status kind for detail banners.
 */
export type DetailStatusKind = "pending" | "rejected" | "validated";
