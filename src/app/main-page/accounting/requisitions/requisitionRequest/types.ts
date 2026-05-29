import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";

/**
 * Props for the travel expense request table.
 */
export type TravelExpenseTableSectionProps = {
  rows: TravelExpense[];
  pagination?: boolean;
  onRefresh: () => void;
  onViewDetails: (row: TravelExpense) => void;
};

/**
 * Minimal beneficiary data required to display requisition viatics.
 */
export type TravelExpenseBeneficiary = {
  id: string;
  name: string;
  phone: string;
  cardNumber: string;
};

/**
 * Visible section in the requisition draft workflow.
 */
export type RequisitionSection = "information" | "viatics";
