import { describe, it, expect, vi } from "vitest";

import type { EmployeesState, Set, Get } from "../types";

import { fetchEmployees } from "./fetchEmployees";

const mockedRequest = vi.fn(async () => ({ data: { data: [{ id: "1" }] } }));

vi.mock("@/app/utilities/Http/requireGateway", () => ({
  requireGateway: () => vi.fn(),
}));
vi.mock("@/app/utilities/Http/promisifyIntranet", () => ({
  pGet: () => mockedRequest,
}));
vi.mock("@/app/mappings/employees/employee.mapper", () => ({
  mapEmployees: (d: unknown[]) => d,
}));

describe("fetchEmployees util", () => {
  it("envia isActive=true por default", async () => {
    mockedRequest.mockClear();
    const state: Partial<EmployeesState> = { employees: [], loading: false };
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === "function"
          ? partial(state as EmployeesState)
          : partial,
      );
    const get: Get = () => state as EmployeesState;

    await fetchEmployees(set, get);

    expect(mockedRequest).toHaveBeenCalledWith("/Employees?isActive=true");
  });

  it("permite sobreescribir isActive por codigo", async () => {
    mockedRequest.mockClear();
    const state: Partial<EmployeesState> = { employees: [], loading: false };
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === "function"
          ? partial(state as EmployeesState)
          : partial,
      );
    const get: Get = () => state as EmployeesState;

    await fetchEmployees(set, get, false, { isActive: false });

    expect(mockedRequest).toHaveBeenCalledWith("/Employees?isActive=false");
  });

  it("deberia poblar empleados y limpiar loading", async () => {
    mockedRequest.mockClear();
    const state: Partial<EmployeesState> = { employees: [], loading: false };
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === "function"
          ? partial(state as EmployeesState)
          : partial,
      );
    const get: Get = () => state as EmployeesState;

    await fetchEmployees(set, get);

    expect(state.employees).toHaveLength(1);
    expect(state.loading).toBe(false);
  });
});
