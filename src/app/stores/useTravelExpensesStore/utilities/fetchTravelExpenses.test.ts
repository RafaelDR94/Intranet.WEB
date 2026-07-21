import { describe, expect, it, vi } from "vitest";

import type { Get, Set, TravelExpensesState } from "../types";

import { fetchTravelExpenses } from "./fetchTravelExpenses";

const getMock = vi.fn();

vi.mock("@/app/utilities/Http/requireGateway", () => ({
  requireGateway: () => vi.fn(),
}));
vi.mock("@/app/utilities/Http/promisifyIntranet", () => ({
  pGet: () => getMock,
}));

describe("fetchTravelExpenses util", () => {
  it("clears stale rows and fetches travel expenses when forced", async () => {
    getMock.mockResolvedValueOnce({
      data: {
        data: [
          {
            id: "travel-1",
            employee_id: "employee-1",
            employeename: "Angel Vazquez",
            requisitionkey: "REQ-TRAVEL-1",
            status: "Pendiente",
          },
        ],
      },
    });

    const state: Partial<TravelExpensesState> = {
      travelExpenses: [
        {
          id: "stale-requisition-request",
          billingrequisition_id: "",
          employee_id: "",
          employeename: "Solicitud anterior",
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
    const get: Get = () => state as TravelExpensesState;

    await fetchTravelExpenses(set, get, true);

    expect(snapshots[0]).toMatchObject({
      loading: true,
      successGet: false,
      travelExpenses: [],
    });
    expect(getMock).toHaveBeenCalledWith("/Billings/TravelExpenses?active=true");
    expect(state.travelExpenses?.[0]?.id).toBe("travel-1");
    expect(state.travelExpenses?.[0]?.employeename).toBe("Angel Vazquez");
    expect(state.loading).toBe(false);
    expect(state.successGet).toBe(true);
  });
});
