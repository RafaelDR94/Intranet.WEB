import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Get, Set, UsersState } from "../types";

import { updateEmployeeDataSAP } from "./updateEmployeeDataSAP";

const putMock = vi.hoisted(() => vi.fn());

vi.mock("@/app/utilities/Http/requireGateway", () => ({
  requireGateway: () => vi.fn(),
}));
vi.mock("@/app/utilities/Http/promisifyIntranet", () => ({
  pPut: () => putMock,
}));
vi.mock("@/app/utilities/Http/normalizeApiError", () => ({
  normalizeApiError: (error: unknown) => ({ message: String(error) }),
}));

describe("updateEmployeeDataSAP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    putMock.mockResolvedValue({ status: 200, data: {} });
  });

  it("sends SAP debtor and client codes to Users/EmployeeDataSAP", async () => {
    const state: Partial<UsersState> = {
      updating: false,
      successPut: false,
    };
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === "function" ? partial(state as UsersState) : partial,
      );
    const get: Get = () => state as UsersState;

    const updated = await updateEmployeeDataSAP(set, get, {
      idEmployee: "f0ccf87b-c135-476e-afe1-8b86a67269d5",
      creditor_number: "AC00021",
      code: "N879",
    });

    expect(updated).toBe(true);
    expect(putMock).toHaveBeenCalledWith("/Users/EmployeeDataSAP", {
      id_employee: "f0ccf87b-c135-476e-afe1-8b86a67269d5",
      creditor_number: "AC00021",
      code: "N879",
    });
    expect(state.updating).toBe(false);
    expect(state.successPut).toBe(true);
  });
});
