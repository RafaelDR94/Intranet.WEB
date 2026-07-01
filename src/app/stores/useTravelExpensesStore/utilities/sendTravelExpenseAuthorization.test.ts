import { describe, expect, it, vi } from "vitest";

import type { Get, Set, TravelExpensesState } from "../types";

import { sendTravelExpenseAuthorization } from "./sendTravelExpenseAuthorization";

const postMock = vi.fn(async () => ({ data: { data: {} } }));

vi.mock("@/app/utilities/Http/requireGateway", () => ({
  requireGateway: () => vi.fn(),
}));

vi.mock("@/app/utilities/Http/promisifyIntranet", () => ({
  pPost: () => postMock,
}));

vi.mock("./fetchTravelExpenses", () => ({
  fetchTravelExpenses: vi.fn(),
}));

describe("sendTravelExpenseAuthorization util", () => {
  it("sends IdTravelExpense and IdAuthorizer to the authorization endpoint", async () => {
    const state: Partial<TravelExpensesState> = {
      sendingAuthorization: false,
      successSendAuthorization: false,
    };
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === "function"
          ? partial(state as TravelExpensesState)
          : partial,
      );
    const get: Get = () => state as TravelExpensesState;

    const success = await sendTravelExpenseAuthorization(
      set,
      get,
      "travel-1",
      "authorizer-1",
    );

    expect(success).toBe(true);
    expect(postMock).toHaveBeenCalledWith(
      expect.stringContaining("IdTravelExpense=travel-1"),
      {},
    );
    expect(postMock).toHaveBeenCalledWith(
      expect.stringContaining("IdAuthorizer=authorizer-1"),
      {},
    );
    expect(state.sendingAuthorization).toBe(false);
    expect(state.successSendAuthorization).toBe(true);
  });
});
