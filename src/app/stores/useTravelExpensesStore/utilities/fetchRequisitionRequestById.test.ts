import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Set, TravelExpensesState } from "../types";

import { fetchRequisitionRequestById } from "./fetchRequisitionRequestById";

const getMock = vi.hoisted(() => vi.fn());

vi.mock("@/app/utilities/Http/requireGateway", () => ({
  requireGateway: () => vi.fn(),
}));
vi.mock("@/app/utilities/Http/promisifyIntranet", () => ({
  pGet: () => getMock,
}));
vi.mock("@/app/utilities/Http/normalizeApiError", () => ({
  normalizeApiError: (error: unknown) => ({ message: String(error) }),
}));

describe("fetchRequisitionRequestById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("prioritizes SAP codes from the requisition request response", async () => {
    getMock.mockResolvedValue({
      status: 200,
      data: {
        data: {
          id: "request-1",
          requisition_code: "R-001",
          creditor_number: "ACN0788",
          client_code: "FUE0044",
          id_user: "user-1",
          state: "Monterrey",
          travel_expense: {
            id: "travel-1",
            employee_id: "employee-1",
            employee_name: "Angel Vazquez",
            creditor_number: null,
            client_code: null,
            id_user: null,
          },
        },
      },
    });
    const state: Partial<TravelExpensesState> = {};
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === "function"
          ? partial(state as TravelExpensesState)
          : partial,
      );

    const result = await fetchRequisitionRequestById(set, "request-1");

    expect(result?.creditor_number).toBe("ACN0788");
    expect(result?.client_code).toBe("FUE0044");
    expect(result?.id_user).toBe("user-1");
    expect(state.currentRequisitionRequest?.creditor_number).toBe("ACN0788");
    expect(state.currentRequisitionRequest?.client_code).toBe("FUE0044");
    expect(result?.state).toBe("Monterrey");
    expect(state.currentRequisitionRequest?.state).toBe("Monterrey");
  });
});
