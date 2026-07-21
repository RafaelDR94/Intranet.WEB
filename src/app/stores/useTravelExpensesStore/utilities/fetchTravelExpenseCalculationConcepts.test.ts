import { describe, expect, it, vi } from "vitest";

import type { Get, Set, TravelExpensesState } from "../types";

import { fetchTravelExpenseCalculationConcepts } from "./fetchTravelExpenseCalculationConcepts";

vi.mock("@/app/utilities/Http/requireGateway", () => ({
  requireGateway: () => vi.fn(),
}));
vi.mock("@/app/utilities/Http/promisifyIntranet", () => ({
  pGet: () => async () => ({
    data: { data: ["Renta de automovil", "Hotel"] },
  }),
}));

describe("fetchTravelExpenseCalculationConcepts util", () => {
  it("llena travelExpenseCalculationConcepts y apaga loadingCalculationConcepts", async () => {
    const state: Partial<TravelExpensesState> = {
      travelExpenseCalculationConcepts: [],
      loadingCalculationConcepts: false,
      successGetCalculationConcepts: false,
    };
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === "function"
          ? partial(state as TravelExpensesState)
          : partial,
      );
    const get: Get = () => state as TravelExpensesState;

    await fetchTravelExpenseCalculationConcepts(set, get);

    expect(state.travelExpenseCalculationConcepts).toEqual([
      "Renta de automovil",
      "Hotel",
    ]);
    expect(state.loadingCalculationConcepts).toBe(false);
    expect(state.successGetCalculationConcepts).toBe(true);
  });
});
