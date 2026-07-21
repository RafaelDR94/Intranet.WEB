import type {
  TravelExpenseCalculation,
  TravelExpenseCalculationApi,
} from "./travelExpenseCalculations.types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toStringSafe = (value: unknown, fallback = ""): string =>
  value == null || value === "" ? fallback : String(value);

/**
 * Normalizes one raw travel expense calculation into the UI contract.
 *
 * @param raw API record from Billings/TravelExpensesCalculations.
 * @returns A normalized travel expense calculation.
 */
export const TravelExpenseCalculationMap = (
  raw: unknown,
): TravelExpenseCalculation => {
  const record = (isRecord(raw) ? raw : {}) as TravelExpenseCalculationApi;

  return {
    id: toStringSafe(
      record.id ??
        record.travel_expenses_calculation_id ??
        record.travelExpensesCalculationId,
    ),
    id_requisition_request: toStringSafe(
      record.id_requisition_request ?? record.idRequisitionRequest,
    ),
    employee_id: toStringSafe(record.employee_id ?? record.employeeId),
    concept: toStringSafe(record.concept ?? record.concept_name ?? record.conceptName),
    national_quoted: toStringSafe(
      record.national_quoted ?? record.nationalQuoted,
      "00",
    ),
    foreign_quoted: toStringSafe(record.foreign_quoted ?? record.foreignQuoted, "00"),
    people: toStringSafe(record.people ?? record.number_people ?? record.numberPeople, "00"),
    days: toStringSafe(record.days, "00"),
    subtotal: toStringSafe(record.subtotal, "00"),
    observations: toStringSafe(record.observations, "Escribe aqui"),
  };
};

/**
 * Normalizes a travel expense calculation list.
 *
 * @param list API records from Billings/TravelExpensesCalculations.
 * @returns Normalized travel expense calculations.
 */
export const TravelExpenseCalculationsMap = (
  list: unknown[],
): TravelExpenseCalculation[] =>
  Array.isArray(list) ? list.map(TravelExpenseCalculationMap) : [];

