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
 * Available tabs in the requisition draft detail.
 */
export type RequisitionSection = "information" | "viatics";

/**
 * Normalized status kind for detail banners.
 */
export type DetailStatusKind = "pending" | "rejected" | "validated";
