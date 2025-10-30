import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Set } from "./types";

vi.mock("./utilities/fetchEmployees", () => ({
  fetchEmployees: vi.fn(async (set: Set) => {
    set({ employees: [{ id: "1" }], loading: false });
  }),
}));

vi.mock("./utilities/fetchEmployeeById", () => ({
  fetchEmployeeById: vi.fn(async (id: string, set: Set) => {
    set({ employee: { employee_id: id }, loadingById: false });
    return { employee_id: id };
  }),
}));

import { useEmployeesStore } from "./useEmployeesStore";

describe("useEmployeesStore", () => {
  beforeEach(() => {
    useEmployeesStore.setState({
      employees: [],
      employee: undefined,
      loading: false,
      loadingById: false,
      error: undefined,
    });
  });

  it("deberia iniciar vacio", () => {
    expect(useEmployeesStore.getState().employees).toEqual([]);
    expect(useEmployeesStore.getState().employee).toBeUndefined();
  });

  it("fetchEmployees actualiza empleados", async () => {
    await useEmployeesStore.getState().fetchEmployees();
    expect(useEmployeesStore.getState().employees).toEqual([{ id: "1" }]);
  });

  it("fetchEmployeeById actualiza employee", async () => {
    const result = await useEmployeesStore
      .getState()
      .fetchEmployeeById("abc");
    expect(result).toEqual({ employee_id: "abc" });
    expect(useEmployeesStore.getState().employee).toEqual({
      employee_id: "abc",
    });
  });
});

