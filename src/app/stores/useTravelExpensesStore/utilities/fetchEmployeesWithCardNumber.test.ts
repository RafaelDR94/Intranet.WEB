import { describe, expect, it, vi } from "vitest";

import type { Get, Set, TravelExpensesState } from "../types";

import { fetchEmployeesWithCardNumber } from "./fetchEmployeesWithCardNumber";

vi.mock("@/app/utilities/Http/requireGateway", () => ({
  requireGateway: () => vi.fn(),
}));
vi.mock("@/app/utilities/Http/promisifyIntranet", () => ({
  pGet: () => async () => ({
    data: {
      data: [
        {
          employee_id: "emp-1",
          full_name: "Demo User",
          phone_number: null,
          card_number: "123 456 7890",
        },
      ],
    },
  }),
}));

describe("fetchEmployeesWithCardNumber util", () => {
  it("llena employeesWithCardNumber y apaga loadingEmployeesWithCardNumber", async () => {
    const state: Partial<TravelExpensesState> = {
      employeesWithCardNumber: [],
      loadingEmployeesWithCardNumber: false,
      successGetEmployeesWithCardNumber: false,
    };
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === "function"
          ? partial(state as TravelExpensesState)
          : partial,
      );
    const get: Get = () => state as TravelExpensesState;

    await fetchEmployeesWithCardNumber(set, get);

    expect(state.employeesWithCardNumber).toEqual([
      {
        employee_id: "emp-1",
        full_name: "Demo User",
        phone_number: "",
        card_number: "123 456 7890",
      },
    ]);
    expect(state.loadingEmployeesWithCardNumber).toBe(false);
    expect(state.successGetEmployeesWithCardNumber).toBe(true);
  });
});
