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
  employeename?: string | null;
  applicant_id?: string | null;
  applicantId?: string | null;
  applicant_name?: string | null;
  applicantName?: string | null;
  phone_number?: string | null;
  phoneNumber?: string | null;
  card_number?: string | null;
  cardNumber?: string | null;
  project_id?: string | null;
  projectId?: string | null;
  projectname?: string | null;
  projectName?: string | null;
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
  statusname?: string | null;
  requisitionkey?: string | null;
  requisitionKey?: string | null;
  assignmentdate?: string | null;
  assignmentDate?: string | null;
  enddate?: string | null;
  endDate?: string | null;
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
};

export type TravelExpenseCompanionApi = {
  id_employee?: string | null;
  idEmployee?: string | null;
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

/**
 * Travel expense row normalized for UI rendering.
 */
export type TravelExpense = {
  id: string;
  billingrequisition_id: string;
  employee_id: string;
  employeename: string;
  applicant_id: string;
  applicant_name: string;
  phone_number: string;
  card_number: string;
  project_id: string;
  projectname: string;
  company: string;
  enterprise_id: string;
  enterprise_name: string;
  area: string;
  department_id: string;
  department_name: string;
  status_id: string;
  status_name: string;
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
};
