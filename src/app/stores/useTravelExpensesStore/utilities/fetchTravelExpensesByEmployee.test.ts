import { describe, expect, it, vi } from "vitest";

import type { Get, Set, TravelExpensesState } from "../types";
import { fetchTravelExpensesByEmployee } from "./fetchTravelExpensesByEmployee";

const getMock = vi.fn();

vi.mock("@/app/utilities/Http/requireGateway", () => ({
  requireGateway: () => vi.fn(),
}));
vi.mock("@/app/utilities/Http/promisifyIntranet", () => ({
  pGet: () => getMock,
}));

describe("fetchTravelExpensesByEmployee util", () => {
  it("requests only the authenticated employee's active travel expenses", async () => {
    getMock.mockResolvedValueOnce({ data: { data: [] } });

    const state: Partial<TravelExpensesState> = {
      travelExpenses: [],
      loading: false,
      successGet: false,
    };
    const set: Set = (partial) => {
      const nextPartial =
        typeof partial === "function"
          ? partial(state as TravelExpensesState)
          : partial;
      Object.assign(state, nextPartial);
    };
    const get: Get = () => state as TravelExpensesState;

    await fetchTravelExpensesByEmployee(set, get, "employee-1", true);

    expect(getMock).toHaveBeenCalledWith(
      "/Billings/TravelExpenses/Employee/employee-1?active=true",
    );
    expect(state.successGet).toBe(true);
  });
});
