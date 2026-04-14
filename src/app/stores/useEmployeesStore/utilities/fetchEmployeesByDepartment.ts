// src/app/stores/useEmployeesStore/utilities/fetchEmployeesByDepartment.ts
import type { Get, Set } from "../types";

import { EmployeesByIdDepartment } from "@/app/configurations/Axios/urls";
import { mapEmployees } from "@/app/mappings/employees/employee.mapper";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

const withLeadingSlash = (path: string) =>
  path.startsWith("/") ? path : `/${path}`;

/**
 * Fetch employees for a specific department and cache them locally.
 * @param departmentId Department identifier to query.
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param force Force refresh even if cached.
 * @returns Employees list for the department.
 */
export const fetchEmployeesByDepartment = async (
  departmentId: string,
  set: Set,
  get: Get,
  force = false,
): Promise<EmployeeType[]> => {
  const cachedId = get().departmentEmployeesDepartmentId;
  const cached = get().departmentEmployees;
  if (!force && cachedId === departmentId && cached.length > 0) {
    set({ successGetByDepartment: true, error: undefined });
    return cached;
  }

  set({
    loadingByDepartment: true,
    error: undefined,
    successGetByDepartment: false,
  });

  try {
    const getFn = requireGateway("get");
    const url = `${withLeadingSlash(EmployeesByIdDepartment)}/${departmentId}`;
    const res = await pGet(getFn)(url);
    const mapped: EmployeeType[] = mapEmployees(res.data?.data ?? res.data ?? []);
    set({
      departmentEmployees: mapped,
      departmentEmployeesDepartmentId: departmentId,
      loadingByDepartment: false,
      successGetByDepartment: true,
    });
    return mapped;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      loadingByDepartment: false,
      error: e.message,
      successGetByDepartment: false,
    });
    return [];
  }
};
