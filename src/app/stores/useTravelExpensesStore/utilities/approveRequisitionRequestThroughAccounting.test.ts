import { describe, expect, it, vi } from "vitest";

import type { Set, TravelExpensesState } from "../types";

import { approveRequisitionRequestThroughAccounting } from "./approveRequisitionRequestThroughAccounting";

const putMock = vi.fn();

vi.mock("@/app/utilities/Http/requireGateway", () => ({
  requireGateway: () => vi.fn(),
}));
vi.mock("@/app/utilities/Http/promisifyIntranet", () => ({
  pPut: () => putMock,
}));

const travelExpense = {
  id: "request-1",
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
  date_created: "",
  updated_date: "",
  created_by: "",
  updated_by: "",
  companions: [],
  requisition_requests: [],
  travel_expenses_calculations: [],
};

describe("approveRequisitionRequestThroughAccounting", () => {
  it("calls accounting approval endpoint and marks request as approved", async () => {
    putMock.mockResolvedValue({ data: { data: null } });

    const state: Partial<TravelExpensesState> = {
      approving: false,
      successApprove: false,
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

    const result = await approveRequisitionRequestThroughAccounting(
      set,
      get,
      "request-1",
    );

    expect(result).toBe(true);
    expect(putMock).toHaveBeenCalledWith(
      "/Auth/ApprovethroughAccounting?IdRequisitionRequest=request-1",
      {},
    );
    expect(state.approving).toBe(false);
    expect(state.successApprove).toBe(true);
    expect(state.currentRequisitionRequest?.status_name).toBe("Aprobada");
    expect(state.travelExpenses?.[0]?.status_name).toBe("Aprobada");
  });
});
