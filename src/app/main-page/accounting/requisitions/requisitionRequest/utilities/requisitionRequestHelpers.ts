import type { TravelExpenseCalculation } from "@/app/mappings/travelExpenseCalculations/travelExpenseCalculations.types";
import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";
import type { EditableViaticsRow } from "@/app/sharedComponents/EditableViaticsTable/types";
import { parseAmount } from "@/app/sharedComponents/EditableViaticsTable/utilities/helperFunction";
import { emptyViaticsRows } from "@/app/sharedComponents/EditableViaticsTable/utilities/mockRows";

import type { TravelExpenseBeneficiary } from "../types";

/**
 * Converts a date-like value to the yyyy-mm-dd format expected by date inputs.
 */
export const toDateInputValue = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toISOString().slice(0, 10);
};

/**
 * Normalizes form values into trimmed strings.
 */
export const toFormString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

/**
 * Converts a date input value into an ISO string for API payloads.
 */
export const toIsoDate = (value: unknown) => {
  const dateValue = toFormString(value);
  if (!dateValue) return "";

  const date = new Date(`${dateValue}T00:00:00`);
  return Number.isNaN(date.getTime()) ? dateValue : date.toISOString();
};

/**
 * Identifies statuses that should keep the requisition in editable draft flow.
 */
export const isDraftStatus = (status: string) =>
  ["borrador", "rechazada"].some((value) =>
    normalizeComparableText(status).includes(value),
  );

/**
 * Returns the most stable identifier available for a travel expense row.
 */
export const getTravelExpenseIdentifier = (row: TravelExpense) =>
  row.id || row.billingrequisition_id || row.requisitionkey;

/**
 * Creates an editable copy of the default viatics rows.
 */
export const cloneEmptyViaticsRows = () =>
  emptyViaticsRows.map((row) => ({ ...row }));

/**
 * Maps saved calculation records back into the editable viatics table shape.
 */
export const mapCalculationsToViaticsRows = (
  calculations: TravelExpenseCalculation[],
  employeeId?: string,
) => {
  const filteredCalculations = employeeId
    ? calculations.filter(
        (calculation) =>
          !calculation.employee_id || calculation.employee_id === employeeId,
      )
    : calculations;

  return cloneEmptyViaticsRows().map((emptyRow, index) => {
    const calculation =
      filteredCalculations.find(
        (item) =>
          normalizeComparableText(item.concept) ===
          normalizeComparableText(emptyRow.concept),
      ) ?? filteredCalculations[index];

    if (!calculation) return emptyRow;

    return {
      ...emptyRow,
      calculationId: calculation.id,
      employeeId: calculation.employee_id || employeeId,
      nationalQuoted: calculation.national_quoted || "00",
      foreignQuoted: calculation.foreign_quoted || "00",
      people: calculation.people || "00",
      days: calculation.days || "00",
      subtotal: calculation.subtotal || "00",
      observations: calculation.observations || "Escribe aqui",
    };
  });
};

/**
 * Builds beneficiary items from the main employee and companions.
 */
export const getTravelExpenseBeneficiaryItems = (
  row: TravelExpense,
): TravelExpenseBeneficiary[] =>
  [
    {
      id: row.employee_id || "primary",
      name: row.employeename,
      phone: row.phone_number,
      cardNumber: row.card_number,
    },
    ...row.companions.map((companion, index) => ({
      id: companion.id_employee || `companion-${index + 1}`,
      name: companion.employee_name,
      phone: companion.phone_number,
      cardNumber: companion.card_number,
    })),
  ].filter((beneficiary) => beneficiary.name || beneficiary.id);

/**
 * Resolves the travel expense area display value.
 */
export const getTravelExpenseArea = (row: TravelExpense) =>
  row.department_name || row.area;

/**
 * Converts viatics rows into calculation payloads for the store action.
 */
export const buildCalculationPayloads = (
  idRequisitionRequest: string,
  rows: EditableViaticsRow[],
  employeeId?: string,
) =>
  rows.map((row) => ({
    id: row.calculationId,
    id_requisition_request: idRequisitionRequest,
    employee_id: row.employeeId || employeeId,
    concept: row.concept,
    national_quoted: parseAmount(row.nationalQuoted),
    foreign_quoted: parseAmount(row.foreignQuoted),
    people: parseAmount(row.people),
    days: parseAmount(row.days),
    subtotal: parseAmount(row.subtotal),
    observations: row.observations,
  }));

const normalizeComparableText = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
