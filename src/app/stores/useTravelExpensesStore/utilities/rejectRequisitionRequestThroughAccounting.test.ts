import { describe, expect, it, vi } from "vitest";

import type { Set, TravelExpensesState } from "../types";

import { rejectRequisitionRequestThroughAccounting } from "./rejectRequisitionRequestThroughAccounting";

const putMock = vi.fn();

vi.mock("@/app/utilities/Http/requireGateway", () => ({
  requireGateway: () => vi.fn(),
}));
vi.mock("@/app/utilities/Http/promisifyIntranet", () => ({
  pPut: () => putMock,
}));

const travelExpense = {
  id: "travel-expense-1",
  billingrequisition_id: "billing-1",
  employee_id: "employee-1",
  employeename: "Bruno Mendoza",
  applicant_id: "",
  applicant_name: "",
  phone_number: "",
  card_number: "",
  project_id: "",
  projectname: "",
  company: "",
  enterprise_id: "",
  enterprise_name: "",
  area: "",
  department_id: "",
  department_name: "",
  status_id: "",
  status_name: "Pendiente",
  status_employee_name: "",
  status: "Pendiente",
  requisitionkey: "REQ-1",
  assignmentdate: "",
  enddate: "",
  state: "",
  motive: "",
  comments: "",
  gt_type: "",
  is_travel_expense: true,
  is_active: true,
  is_approved_by_accounting: false,
  date_created: "",
  updated_date: "",
  created_by: "",
  updated_by: "",
  companions: [],
  requisition_requests: [{
    id: "request-1",
    id_travel_expense: "travel-expense-1",
    requisition_code: "REQ-1",
    id_status: "",
    status_name: "Pendiente",
    is_active: true,
    date_created: "",
  }],
  travel_expenses_calculations: [],
};

describe("rejectRequisitionRequestThroughAccounting", () => {
  it("calls accounting rejection endpoint and marks request as rejected", async () => {
    putMock.mockResolvedValue({ data: { data: null } });

    const state: Partial<TravelExpensesState> = {
      rejecting: false,
      successReject: false,
      travelExpenses: [travelExpense],
      currentRequisitionRequest: travelExpense,
    };
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === "function"
          ? partial(state as TravelExpensesState)
          : partial,
      );
    const get = () => state as TravelExpensesState;

    const result = await rejectRequisitionRequestThroughAccounting(set, get, {
      idRequisitionRequest: "request-1",
      comment: "No procede",
    });

    expect(result).toBe(true);
    expect(putMock).toHaveBeenCalledWith(
      "/Auth/RejectedByAccounting?IdRequisitionRequest=request-1&comment=No+procede",
      {},
    );
    expect(state.rejecting).toBe(false);
    expect(state.successReject).toBe(true);
    expect(state.currentRequisitionRequest?.status_name).toBe("Rechazada");
    expect(state.travelExpenses?.[0]?.status_name).toBe("Rechazada");
  });
});
