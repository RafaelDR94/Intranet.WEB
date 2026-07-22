/**
 * Raw travel expense requisition as returned by the API.
 */
export type TravelExpenseApi = {
  id?: string | null;
  billingrequisition_id?: string | null;
  billingrequisitionId?: string | null;
  billingRequisitionId?: string | null;
  billingRequisition_Id?: string | null;
  BillingRequisition_Id?: string | null;
  employee_id?: string | null;
  employeeId?: string | null;
  employee_name?: string | null;
  employeeName?: string | null;
  employeename?: string | null;
  full_name?: string | null;
  fullName?: string | null;
  applicant_id?: string | null;
  applicantId?: string | null;
  id_user?: string | null;
  idUser?: string | null;
  user_id?: string | null;
  userId?: string | null;
  applicant_name?: string | null;
  applicantName?: string | null;
  creditor_number?: string | null;
  client_code?: string | null;
  phone_number?: string | null;
  phoneNumber?: string | null;
  card_number?: string | null;
  cardNumber?: string | null;
  project_id?: string | null;
  projectId?: string | null;
  projectname?: string | null;
  projectName?: string | null;
  proyectkey?: string | null;
  proyectKey?: string | null;
  projectkey?: string | null;
  projectKey?: string | null;
  company?: string | null;
  companyname?: string | null;
  enterprise?: string | null;
  enterprisename?: string | null;
  enterprise_id?: string | null;
  enterpriseId?: string | null;
  enterprise_name?: string | null;
  enterpriseName?: string | null;
  area?: string | null;
  areaname?: string | null;
  department_id?: string | null;
  departmentId?: string | null;
  department_name?: string | null;
  departmentName?: string | null;
  status_id?: string | null;
  status?: string | null;
  status_name?: string | null;
  status_employee_name?: string | null;
  statusEmployeeName?: string | null;
  statusname?: string | null;
  requisitionkey?: string | null;
  requisitionKey?: string | null;
  assignmentdate?: string | null;
  assignmentDate?: string | null;
  start_date?: string | null;
  startDate?: string | null;
  enddate?: string | null;
  endDate?: string | null;
  end_date?: string | null;
  state?: string | null;
  motive?: string | null;
  comments?: string | null;
  comment?: string | null;
  user_comments?: string | null;
  userComments?: string | null;
  gt_type?: string | null;
  gtType?: string | null;
  is_travel_expense?: boolean | null;
  isTravelExpense?: boolean | null;
  is_active?: boolean | null;
  isActive?: boolean | null;
  date_created?: string | null;
  dateCreated?: string | null;
  updated_date?: string | null;
  updatedDate?: string | null;
  created_by?: string | null;
  createdBy?: string | null;
  updated_by?: string | null;
  updatedBy?: string | null;
  companions?: TravelExpenseCompanionApi[] | null;
  requisition_requests?: TravelExpenseRequisitionRequestApi[] | null;
  travel_expenses_calculations?: unknown[] | null;
  calculation_concepts?: TravelExpenseCalculationConceptJsonApi[] | null;
  calculationConcepts?: TravelExpenseCalculationConceptJsonApi[] | null;
  calculation_concepts_json?: TravelExpenseProgressItemApi[] | string | null;
  calculationConceptsJson?: TravelExpenseProgressItemApi[] | string | null;
  requisition_code?: string | null;
  requisitionCode?: string | null;
  is_approved_by_accounting?: boolean | null;
  isApprovedByAccounting?: boolean | null;
};

export type TravelExpenseCompanionApi = {
  employee_id?: string | null;
  employeeId?: string | null;
  id_employee?: string | null;
  idEmployee?: string | null;
  full_name?: string | null;
  fullName?: string | null;
  employee_name?: string | null;
  employeeName?: string | null;
  phone_number?: string | null;
  phoneNumber?: string | null;
  card_number?: string | null;
  cardNumber?: string | null;
};

export type TravelExpenseCompanion = {
  id_employee: string;
  employee_name: string;
  phone_number: string;
  card_number: string;
};

export type TravelExpenseRequisitionRequestApi = {
  id?: string | null;
  id_travel_expense?: string | null;
  idTravelExpense?: string | null;
  requisition_code?: string | null;
  requisitionCode?: string | null;
  id_status?: string | null;
  idStatus?: string | null;
  status_name?: string | null;
  statusName?: string | null;
  is_active?: boolean | null;
  isActive?: boolean | null;
  date_created?: string | null;
  dateCreated?: string | null;
};

export type TravelExpenseRequisitionRequest = {
  id: string;
  id_travel_expense: string;
  requisition_code: string;
  id_status: string;
  status_name: string;
  is_active: boolean;
  date_created: string;
};

export type TravelExpenseCalculationConceptJsonApi = {
  concept?: string | null;
  national_quoted?: number | string | null;
  nationalQuoted?: number | string | null;
  foreign_quoted?: number | string | null;
  foreignQuoted?: number | string | null;
  people_number?: number | string | null;
  peopleNumber?: number | string | null;
  days_number?: number | string | null;
  daysNumber?: number | string | null;
  subtotal?: number | string | null;
  observations?: string | null;
};

export type TravelExpenseProgressCompanionApi = {
  employee_id?: string | null;
  employeeId?: string | null;
  full_name?: string | null;
  fullName?: string | null;
  employee_name?: string | null;
  employeeName?: string | null;
};

export type TravelExpenseProgressItemApi = {
  employee_id?: string | null;
  employeeId?: string | null;
  employee_name?: string | null;
  employeeName?: string | null;
  requisition_code?: string | null;
  requisitionCode?: string | null;
  motive?: string | null;
  start_date?: string | null;
  startDate?: string | null;
  end_date?: string | null;
  endDate?: string | null;
  companions?: TravelExpenseProgressCompanionApi[] | null;
  calculation_concepts?: TravelExpenseCalculationConceptJsonApi[] | null;
  calculationConcepts?: TravelExpenseCalculationConceptJsonApi[] | null;
};

/**
 * Travel expense row normalized for UI rendering.
 */
export type TravelExpense = {
  id: string;
  billingrequisition_id: string;
  employee_id: string;
  employeename: string;
  applicant_id: string;
  id_user: string;
  applicant_name: string;
  creditor_number: string;
  client_code: string;
  phone_number: string;
  card_number: string;
  project_id: string;
  projectname: string;
  proyectkey?: string;
  company: string;
  enterprise_id: string;
  enterprise_name: string;
  area: string;
  department_id: string;
  department_name: string;
  status_id: string;
  status_name: string;
  status_employee_name: string;
  status: string;
  requisitionkey: string;
  assignmentdate: string;
  enddate: string;
  state: string;
  motive: string;
  comments: string;
  gt_type: string;
  is_travel_expense: boolean;
  is_active: boolean;
  date_created: string;
  updated_date: string;
  created_by: string;
  updated_by: string;
  companions: TravelExpenseCompanion[];
  requisition_requests: TravelExpenseRequisitionRequest[];
  travel_expenses_calculations: unknown[];
  calculation_concepts_json?: TravelExpenseProgressItemApi[];
  is_approved_by_accounting: boolean;
};
