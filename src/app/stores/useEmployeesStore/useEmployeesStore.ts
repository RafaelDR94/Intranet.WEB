// src/app/stores/employees/useEmployeesStore.ts
"use client";

import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import type { EmployeesState } from "./types";
import {
  activateEmployee as activateEmployeeRequest,
  createEmployee as createEmployeeRequest,
  deleteEmployee as deleteEmployeeRequest,
  fetchActiveEmployees as fetchActiveEmployeesRequest,
  fetchEmployeesByDepartment as fetchEmployeesByDepartmentRequest,
  fetchEmployeeById as fetchEmployeeByIdRequest,
  fetchEmployees as fetchEmployeesRequest,
  updateEmployee as updateEmployeeRequest,
} from "./utilities";
import { EmployeeType } from "@/app/mappings/employees/employee.types";

const initialCollections: Pick<
  EmployeesState,
  "employees" | "activeEmployees" | "departmentEmployees" | "departmentEmployeesDepartmentId" | "employee"
> = {
  employees: [],
  activeEmployees: [],
  departmentEmployees: [],
  departmentEmployeesDepartmentId: undefined,
  employee: undefined,
};

const initialFlags: Pick<
  EmployeesState,
  | "loading"
  | "loadingById"
  | "loadingActive"
  | "loadingByDepartment"
  | "creating"
  | "updating"
  | "deleting"
  | "activating"
  | "successGet"
  | "successGetById"
  | "successGetActive"
  | "successGetByDepartment"
  | "successPost"
  | "successPut"
  | "successDelete"
  | "successActivate"
  | "error"
  | "warning"
> = {
  loading: false,
  loadingById: false,
  loadingActive: false,
  loadingByDepartment: false,
  creating: false,
  updating: false,
  deleting: false,
  activating: false,
  successGet: false,
  successGetById: false,
  successGetActive: false,
  successGetByDepartment: false,
  successPost: false,
  successPut: false,
  successDelete: false,
  successActivate: false,
  error: undefined,
  warning: undefined,
};

/**
 * Global Zustand store for employee catalog.
 *
 * Maintains employees listings, detail, and exposes mutations.
 */
export const useEmployeesStore = createWithEqualityFn<EmployeesState>()(
  devtools((set, get) => ({
    ...initialCollections,
    ...initialFlags,

    fetchEmployees: (force = false) => fetchEmployeesRequest(set, get, force),
    fetchActiveEmployees: (force = false) =>
      fetchActiveEmployeesRequest(set, get, force),
    fetchEmployeesByDepartment: (departmentId: string, force = false) =>
      fetchEmployeesByDepartmentRequest(departmentId, set, get, force),
    fetchEmployeeById: (id: string, force = false) =>
      fetchEmployeeByIdRequest(id, set, get, force),
    createEmployee: (payload) => createEmployeeRequest(set, get, payload),
    updateEmployee: (payload) => updateEmployeeRequest(set, get, payload),
    deleteEmployee: (id: string) => deleteEmployeeRequest(set, get, id),
    activateEmployee: (id: string) => activateEmployeeRequest(set, get, id),
    forceFetchEmployees: async () => {
      await fetchEmployeesRequest(set, get, true);
    },

    reset: () =>
      set({
        ...initialCollections,
        ...initialFlags,
      }),
    resetFlags: () =>
      set({
        ...initialFlags,
      }),
    resetEmployee: () =>
      set({ employee: undefined }),
    setCurrentEmployee: (employee: EmployeeType) => {
      set({ employee: employee })
    },
  }))
);

