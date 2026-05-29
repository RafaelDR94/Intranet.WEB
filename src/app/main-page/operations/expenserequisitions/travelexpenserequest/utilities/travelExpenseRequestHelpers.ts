import type { LabelType } from "@/app/components/Label/types";
import type { TravelExpenseCalculation } from "@/app/mappings/travelExpenseCalculations/travelExpenseCalculations.types";
import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";
import type { EditableViaticsRow } from "@/app/sharedComponents/EditableViaticsTable/types";
import { parseAmount } from "@/app/sharedComponents/EditableViaticsTable/utilities/helperFunction";
import { emptyViaticsRows } from "@/app/sharedComponents/EditableViaticsTable/utilities/mockRows";

import type { DetailStatusKind, TravelExpenseBeneficiary } from "../types";

/**
 * Formats API date strings for display in tables.
 */
export const formatDate = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

/**
 * Converts date strings to yyyy-mm-dd for date inputs.
 */
export const toDateInputValue = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toISOString().slice(0, 10);
};

/**
 * Normalizes unknown form values into trimmed strings.
 */
export const toFormString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

/**
 * Converts a date input value to an ISO string for API payloads.
 */
export const toIsoDate = (value: unknown) => {
  const dateValue = toFormString(value);
  if (!dateValue) return "";

  const date = new Date(`${dateValue}T00:00:00`);
  return Number.isNaN(date.getTime()) ? dateValue : date.toISOString();
};

/**
 * Maps request statuses to label styles.
 */
export const normalizeStatusType = (status = ""): LabelType => {
  const normalized = normalizeComparableText(status);

  if (normalized.includes("borrador")) return "purple";
  if (normalized.includes("rechaz")) return "rechazado";
  if (normalized.includes("aprobad") || normalized.includes("valid")) {
    return "validado";
  }
  if (normalized.includes("cancel")) return "restringido";

  return "pendiente";
};

/**
 * Detects statuses that should open the requisition draft workflow.
 */
export const isDraftStatus = (status: string) =>
  ["borrador", "rechazada"].some((value) =>
    normalizeComparableText(status).includes(value),
  );

/**
 * Returns the stable identifier for a travel expense row.
 */
export const getTravelExpenseIdentifier = (row: TravelExpense) =>
  row.id || row.billingrequisition_id || row.requisitionkey;

/**
 * Creates editable viatics rows from the shared empty template.
 */
export const cloneEmptyViaticsRows = () =>
  emptyViaticsRows.map((row) => ({ ...row }));

/**
 * Maps persisted calculations back to editable viatics rows.
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
 * Gets beneficiary names from the main employee and companions.
 */
export const getTravelExpenseBeneficiaries = (row: TravelExpense) =>
  [
    row.employeename,
    ...row.companions.map((companion) => companion.employee_name),
  ].filter(Boolean);

/**
 * Builds beneficiary data for requisition accordion sections.
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
 * Resolves the display area for a request.
 */
export const getTravelExpenseArea = (row: TravelExpense) =>
  row.department_name || row.area;

/**
 * Converts editable viatics rows into API calculation payloads.
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

/**
 * Converts status text into the coarse detail status kind.
 */
export const getDetailStatusKind = (status = ""): DetailStatusKind => {
  const normalized = normalizeComparableText(status);

  if (normalized.includes("rechaz")) return "rejected";
  if (normalized.includes("aprobad") || normalized.includes("valid")) {
    return "validated";
  }

  return "pending";
};

const normalizeComparableText = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
