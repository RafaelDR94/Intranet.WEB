import { describe, it, expect, vi } from "vitest";

import type { EmployeesState, Set, Get } from "../types";

import { fetchEmployeesByDepartment } from "./fetchEmployeesByDepartment";

vi.mock("@/app/utilities/Http/requireGateway", () => ({
  requireGateway: () => vi.fn(),
}));
vi.mock("@/app/utilities/Http/promisifyIntranet", () => ({
  pGet: () => async () => ({ data: { data: [{ id: "1" }] } }),
}));
vi.mock("@/app/mappings/employees/employee.mapper", () => ({
  mapEmployees: (d: unknown[]) => d,
}));

describe("fetchEmployeesByDepartment util", () => {
  it("deberia poblar empleados por departamento y limpiar loading", async () => {
    const state: Partial<EmployeesState> = {
      departmentEmployees: [],
      loadingByDepartment: false,
    };
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === "function"
          ? partial(state as EmployeesState)
          : partial,
      );
    const get: Get = () => state as EmployeesState;

    await fetchEmployeesByDepartment("dep-1", set, get);

    expect(state.departmentEmployees).toHaveLength(1);
    expect(state.loadingByDepartment).toBe(false);
    expect(state.departmentEmployeesDepartmentId).toBe("dep-1");
  });
});
