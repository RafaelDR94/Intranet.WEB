import { describe, expect, it, vi } from "vitest";

import type { Set, TravelExpensesState } from "../types";

import { fetchRequisitionRequests } from "./fetchRequisitionRequests";

const getMock = vi.fn();

vi.mock("@/app/utilities/Http/requireGateway", () => ({
  requireGateway: () => vi.fn(),
}));
vi.mock("@/app/utilities/Http/promisifyIntranet", () => ({
  pGet: () => getMock,
}));

describe("fetchRequisitionRequests util", () => {
  it("clears stale rows and fetches requisition requests", async () => {
    getMock.mockResolvedValueOnce({
      data: {
        data: [
          {
            id: "request-1",
            id_employee: "employee-1",
            employee_name: "Bruno Mendoza",
            applicant_name: "Admin",
            email: "admin@drsecurity.net",
            requisition_code: "REQ-001",
            status_name: "CONTABILIDAD",
            treasury_status_name: "APROBADA",
            accounting_status_name: "PENDIENTE",
            image_urls: ["https://files.example/request-1.png"],
          },
        ],
      },
    });

    const state: Partial<TravelExpensesState> = {
      travelExpenses: [
        {
          id: "stale-travel-expense",
          billingrequisition_id: "",
          employee_id: "",
          employeename: "Dato anterior",
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
          status_name: "",
          status: "",
          requisitionkey: "",
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
        },
      ],
      loading: false,
      successGet: true,
    };
    const snapshots: Partial<TravelExpensesState>[] = [];
    const set: Set = (partial) => {
      const nextPartial =
        typeof partial === "function"
          ? partial(state as TravelExpensesState)
          : partial;
      snapshots.push(nextPartial);
      Object.assign(state, nextPartial);
    };
    await fetchRequisitionRequests(set);

    expect(snapshots[0]).toMatchObject({
      loading: true,
      successGet: false,
      travelExpenses: [],
    });
    expect(getMock).toHaveBeenCalledWith(
      "/Billings/RequisitionRequest?department=CONTABILIDAD",
    );
    expect(state.travelExpenses?.[0]?.id).toBe("request-1");
    expect(state.travelExpenses?.[0]?.employeename).toBe("Bruno Mendoza");
    expect(state.travelExpenses?.[0]).toMatchObject({
      status_name: "CONTABILIDAD",
      treasury_status_name: "APROBADA",
      accounting_status_name: "PENDIENTE",
      image_urls: ["https://files.example/request-1.png"],
    });
    expect(state.loading).toBe(false);
    expect(state.successGet).toBe(true);
  });
});
