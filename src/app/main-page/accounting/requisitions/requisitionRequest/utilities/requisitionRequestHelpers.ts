import type { TravelExpenseCalculation } from "@/app/mappings/travelExpenseCalculations/travelExpenseCalculations.types";
import type {
  TravelExpense,
  TravelExpenseCalculationConceptJsonApi,
} from "@/app/mappings/travelExpenses/travelExpenses.types";
import type { EditableViaticsRow } from "@/app/sharedComponents/EditableViaticsTable/types";
import type { SaveTravelExpenseProgressPayload } from "@/app/stores/useTravelExpensesStore/types";
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

const toEditableAmount = (value: unknown, fallback = "00") =>
  value == null || value === "" ? fallback : String(value);

const getCalculationConcept = (
  calculation: TravelExpenseCalculationConceptJsonApi,
) => toFormString(calculation.concept);

const getProgressCalculations = (row: TravelExpense) =>
  row.calculation_concepts_json?.flatMap(
    (item) => item.calculation_concepts ?? item.calculationConcepts ?? [],
  ) ?? [];

/**
 * Gets the first persisted progress block from calculation_concepts_json.
 */
export const getFirstProgressItemValues = (row: TravelExpense) => {
  const progressItem = row.calculation_concepts_json?.[0];

  return {
    requisitionCode: toFormString(
      progressItem?.requisition_code ?? progressItem?.requisitionCode,
    ),
    startDate: toFormString(
      progressItem?.start_date ?? progressItem?.startDate,
    ),
    endDate: toFormString(progressItem?.end_date ?? progressItem?.endDate),
    motive: toFormString(progressItem?.motive),
  };
};

/**
 * Maps calculation_concepts_json into the editable viatics table shape.
 */
export const mapCalculationConceptsJsonToViaticsRows = (row: TravelExpense) => {
  const calculations = getProgressCalculations(row);

  return cloneEmptyViaticsRows().map((emptyRow, index) => {
    const calculation =
      calculations.find(
        (item) =>
          normalizeComparableText(getCalculationConcept(item)) ===
          normalizeComparableText(emptyRow.concept),
      ) ?? calculations[index];

    if (!calculation) return emptyRow;

    return {
      ...emptyRow,
      nationalQuoted: toEditableAmount(
        calculation.national_quoted ?? calculation.nationalQuoted,
      ),
      foreignQuoted: toEditableAmount(
        calculation.foreign_quoted ?? calculation.foreignQuoted,
      ),
      people: toEditableAmount(
        calculation.people_number ?? calculation.peopleNumber,
      ),
      days: toEditableAmount(calculation.days_number ?? calculation.daysNumber),
      subtotal: toEditableAmount(calculation.subtotal),
      observations:
        toFormString(calculation.observations) || emptyRow.observations,
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

/**
 * Builds the consolidated SaveProgress payload expected by backend.
 */
export const buildSaveProgressPayload = (
  row: TravelExpense,
  rows: EditableViaticsRow[],
): SaveTravelExpenseProgressPayload => ({
  id_travel_expense: getTravelExpenseIdentifier(row),
  progress_items: [
    {
      employee_id: row.employee_id,
      employee_name: row.employeename,
      requisition_code: row.requisition_requests[0]?.requisition_code ?? "",
      motive: row.motive,
      start_date: toIsoDate(toDateInputValue(row.assignmentdate)),
      end_date: toIsoDate(toDateInputValue(row.enddate)),
      companions: row.companions
        .map((companion) => ({
          employee_id: companion.id_employee,
          full_name: companion.employee_name,
        }))
        .filter((companion) => companion.employee_id || companion.full_name),
      calculation_concepts: rows.map((item) => ({
        concept: item.concept,
        national_quoted: parseAmount(item.nationalQuoted),
        foreign_quoted: parseAmount(item.foreignQuoted),
        people_number: parseAmount(item.people),
        days_number: parseAmount(item.days),
        subtotal: parseAmount(item.subtotal),
        observations: item.observations,
      })),
    },
  ],
});

const normalizeComparableText = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
