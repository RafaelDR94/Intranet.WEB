/**
 * Raw travel expense calculation record as returned by the API.
 */
export type TravelExpenseCalculationApi = {
  id?: string | number | null;
  travel_expenses_calculation_id?: string | number | null;
  travelExpensesCalculationId?: string | number | null;
  id_requisition_request?: string | number | null;
  idRequisitionRequest?: string | number | null;
  employee_id?: string | number | null;
  employeeId?: string | number | null;
  concept?: string | null;
  concept_name?: string | null;
  conceptName?: string | null;
  national_quoted?: string | number | null;
  nationalQuoted?: string | number | null;
  foreign_quoted?: string | number | null;
  foreignQuoted?: string | number | null;
  people?: string | number | null;
  number_people?: string | number | null;
  numberPeople?: string | number | null;
  days?: string | number | null;
  subtotal?: string | number | null;
  observations?: string | null;
};

/**
 * Normalized travel expense calculation used by UI mappers.
 */
export type TravelExpenseCalculation = {
  id: string;
  id_requisition_request: string;
  employee_id: string;
  concept: string;
  national_quoted: string;
  foreign_quoted: string;
  people: string;
  days: string;
  subtotal: string;
  observations: string;
};

