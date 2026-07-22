import type { TravelExpense, TravelExpenseApi } from "./travelExpenses.types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toStringSafe = (value: unknown, fallback = ""): string =>
  value == null ? fallback : String(value);

const toBooleanSafe = (value: unknown): boolean =>
  typeof value === "boolean" ? value : Boolean(value);

const parseCalculationConceptsJson = (
  value: TravelExpenseApi["calculation_concepts_json"],
): TravelExpense["calculation_concepts_json"] => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];

  try {
    const parsedValue: unknown = JSON.parse(value);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

const mapCalculationConceptsJson = (
  record: TravelExpenseApi,
): TravelExpense["calculation_concepts_json"] => {
  const progressItems =
    parseCalculationConceptsJson(
      record.calculation_concepts_json ?? record.calculationConceptsJson,
    ) ?? [];

  if (progressItems.length > 0) return progressItems;

  const calculationConcepts =
    record.calculation_concepts ?? record.calculationConcepts ?? [];

  if (!Array.isArray(calculationConcepts) || calculationConcepts.length === 0) {
    return [];
  }

  return [
    {
      employee_id: record.employee_id ?? record.employeeId,
      employee_name:
        record.employee_name ??
        record.employeeName ??
        record.employeename ??
        record.full_name ??
        record.fullName,
      requisition_code: record.requisition_code ?? record.requisitionCode,
      motive: record.motive,
      start_date:
        record.start_date ??
        record.startDate ??
        record.assignmentdate ??
        record.assignmentDate,
      end_date: record.end_date ?? record.endDate ?? record.enddate,
      companions: record.companions?.map((companion) => ({
        employee_id:
          companion.employee_id ??
          companion.employeeId ??
          companion.id_employee,
        full_name:
          companion.full_name ?? companion.fullName ?? companion.employee_name,
      })),
      calculation_concepts: calculationConcepts,
    },
  ];
};

const mapCompanions = (
  companions: TravelExpenseApi["companions"],
): TravelExpense["companions"] =>
  Array.isArray(companions)
    ? companions.map((companion) => ({
        id_employee: toStringSafe(
          companion.id_employee ??
            companion.idEmployee ??
            companion.employee_id ??
            companion.employeeId,
        ),
        employee_name: toStringSafe(
          companion.employee_name ??
            companion.employeeName ??
            companion.full_name ??
            companion.fullName,
        ),
        phone_number: toStringSafe(
          companion.phone_number ?? companion.phoneNumber,
        ),
        card_number: toStringSafe(
          companion.card_number ?? companion.cardNumber,
        ),
      }))
    : [];

const mapRequisitionRequests = (
  requisitions: TravelExpenseApi["requisition_requests"],
): TravelExpense["requisition_requests"] =>
  Array.isArray(requisitions)
    ? requisitions.map((requisition) => ({
        id: toStringSafe(requisition.id),
        id_travel_expense: toStringSafe(
          requisition.id_travel_expense ?? requisition.idTravelExpense,
        ),
        requisition_code: toStringSafe(
          requisition.requisition_code ?? requisition.requisitionCode,
        ),
        id_status: toStringSafe(requisition.id_status ?? requisition.idStatus),
        status_name: toStringSafe(
          requisition.status_name ?? requisition.statusName,
        ),
        is_active: toBooleanSafe(requisition.is_active ?? requisition.isActive),
        date_created: toStringSafe(
          requisition.date_created ?? requisition.dateCreated,
        ),
      }))
    : [];

/**
 * Normalizes one raw travel expense requisition into the UI contract.
 *
 * @param raw API record from Billings/TravelExpenses.
 * @returns A normalized travel expense item.
 */
export const TravelExpenseMap = (raw: unknown): TravelExpense => {
  const record = (isRecord(raw) ? raw : {}) as TravelExpenseApi;
  const billingrequisition_id = toStringSafe(
    record.billingrequisition_id ??
      record.billingrequisitionId ??
      record.billingRequisitionId ??
      record.billingRequisition_Id ??
      record.BillingRequisition_Id ??
      record.id,
  );
  const id = toStringSafe(record.id ?? billingrequisition_id);
  const status = toStringSafe(
    record.status ?? record.status_name ?? record.statusname,
    "Pendiente",
  );
  const statusName = toStringSafe(record.status_name ?? record.statusname);
  const statusEmployeeName = toStringSafe(
    record.status_employee_name ?? record.statusEmployeeName,
  );

  return {
    id,
    billingrequisition_id,
    employee_id: toStringSafe(record.employee_id ?? record.employeeId),
    employeename: toStringSafe(
      record.employeename ??
        record.employee_name ??
        record.employeeName ??
        record.full_name ??
        record.fullName,
    ),
    applicant_id: toStringSafe(record.applicant_id ?? record.applicantId),
    id_user: toStringSafe(
      record.id_user ?? record.idUser ?? record.user_id ?? record.userId,
    ),
    applicant_name: toStringSafe(record.applicant_name ?? record.applicantName),
    creditor_number: toStringSafe(record.creditor_number),
    client_code: toStringSafe(record.client_code),
    phone_number: toStringSafe(record.phone_number ?? record.phoneNumber),
    card_number: toStringSafe(record.card_number ?? record.cardNumber),
    project_id: toStringSafe(record.project_id ?? record.projectId),
    projectname: toStringSafe(record.projectname ?? record.projectName),
    proyectkey: toStringSafe(
      record.proyectkey ??
        record.proyectKey ??
        record.projectkey ??
        record.projectKey ??
        record.projectname ??
        record.projectName,
    ),
    company: toStringSafe(
      record.company ??
        record.companyname ??
        record.enterprise ??
        record.enterprisename ??
        record.enterprise_name ??
        record.enterpriseName,
    ),
    enterprise_id: toStringSafe(record.enterprise_id ?? record.enterpriseId),
    enterprise_name: toStringSafe(
      record.enterprise_name ?? record.enterpriseName,
    ),
    area: toStringSafe(
      record.area ??
        record.areaname ??
        record.department_name ??
        record.departmentName,
    ),
    department_id: toStringSafe(record.department_id ?? record.departmentId),
    department_name: toStringSafe(
      record.department_name ?? record.departmentName,
    ),
    status_id: toStringSafe(record.status_id),
    status_name: statusName,
    status_employee_name: statusEmployeeName,
    status,
    requisitionkey: toStringSafe(
      record.requisitionkey ??
        record.requisitionKey ??
        record.requisition_code ??
        record.requisitionCode,
    ),
    assignmentdate: toStringSafe(
      record.assignmentdate ??
        record.assignmentDate ??
        record.start_date ??
        record.startDate,
    ),
    enddate: toStringSafe(record.enddate ?? record.endDate ?? record.end_date),
    state: toStringSafe(record.state),
    motive: toStringSafe(record.motive),
    comments: toStringSafe(
      record.comments ??
        record.comment ??
        record.user_comments ??
        record.userComments,
    ),
    gt_type: toStringSafe(record.gt_type ?? record.gtType),
    is_travel_expense: toBooleanSafe(
      record.is_travel_expense ?? record.isTravelExpense,
    ),
    is_active: toBooleanSafe(record.is_active ?? record.isActive),
    is_approved_by_accounting: toBooleanSafe(
      record.is_approved_by_accounting ?? record.isApprovedByAccounting,
    ),
    date_created: toStringSafe(record.date_created ?? record.dateCreated),
    updated_date: toStringSafe(record.updated_date ?? record.updatedDate),
    created_by: toStringSafe(
      record.created_by ??
        record.createdBy ??
        record.applicant_name ??
        record.applicantName,
    ),
    updated_by: toStringSafe(record.updated_by ?? record.updatedBy),
    companions: mapCompanions(record.companions),
    requisition_requests: mapRequisitionRequests(record.requisition_requests),
    travel_expenses_calculations: Array.isArray(
      record.travel_expenses_calculations,
    )
      ? record.travel_expenses_calculations
      : [],
    calculation_concepts_json: mapCalculationConceptsJson(record),
  };
};

/**
 * Normalizes a raw travel expense list.
 *
 * @param list API records from Billings/TravelExpenses.
 * @returns Normalized travel expense items.
 */
export const TravelExpensesMap = (list: unknown[]): TravelExpense[] =>
  Array.isArray(list) ? list.map(TravelExpenseMap) : [];
