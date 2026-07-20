import { describe, expect, it, vi } from "vitest";

import type {
  Get,
  SaveTravelExpenseProgressPayload,
  Set,
  TravelExpensesState,
} from "../types";

import { saveTravelExpenseProgress } from "./saveTravelExpenseProgress";

const putMock = vi.fn();

vi.mock("@/app/utilities/Http/requireGateway", () => ({
  requireGateway: () => vi.fn(),
}));
vi.mock("@/app/utilities/Http/promisifyIntranet", () => ({
  pPut: () => putMock,
}));
vi.mock("./fetchTravelExpenses", () => ({
  fetchTravelExpenses: async (set: Set) => {
    set({
      travelExpenses: [
        {
          id: "travel-1",
          billingrequisition_id: "",
          employee_id: "",
          employeename: "",
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
    });
  },
}));

describe("saveTravelExpenseProgress util", () => {
  it("activa successSaveProgress y refresca la requisicion", async () => {
    putMock.mockResolvedValue({ data: { data: null } });

    const state: Partial<TravelExpensesState> = {
      travelExpenses: [],
      savingProgress: false,
      successSaveProgress: false,
    };
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === "function"
          ? partial(state as TravelExpensesState)
          : partial,
      );
    const get: Get = () => state as TravelExpensesState;
    const payload: SaveTravelExpenseProgressPayload = {
      id_travel_expense: "travel-1",
      progress_items: [
        {
          employee_id: "employee-1",
          employee_name: "Angel Vazquez",
          requisition_code: "REQ-001",
          motive: "Instalacion",
          start_date: "2026-05-10T00:00:00.000Z",
          end_date: "2026-05-15T00:00:00.000Z",
          subtotal: 0,
          total: 0,
          companions: [],
          calculation_concepts: [],
        },
      ],
    };

    const result = await saveTravelExpenseProgress(set, get, payload);

    expect(putMock).toHaveBeenCalledWith(expect.any(String), payload);
    expect(state.savingProgress).toBe(false);
    expect(state.successSaveProgress).toBe(true);
    expect(state.travelExpenses).toHaveLength(1);
    expect(result).not.toBeNull();
  });
});
