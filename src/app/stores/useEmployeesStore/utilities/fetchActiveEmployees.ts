// src/app/stores/useEmployeesStore/utilities/fetchActiveEmployees.ts
import type { Set, Get } from "../types";

import { Employees, EmployeesIsActive } from "@/app/configurations/Axios/urls";
import { mapEmployees } from "@/app/mappings/employees/employee.mapper";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

const withLeadingSlash = (path: string) =>
  path.startsWith("/") ? path : `/${path}`;

const ACTIVE_ENDPOINT = EmployeesIsActive
  ? withLeadingSlash(EmployeesIsActive)
  : `${Employees}?IsActive=true`;

/**
 * Fetch only active employees and cache them locally.
 */
export const fetchActiveEmployees = async (
  set: Set,
  get: Get,
  force = false
) => {
  if (get().activeEmployees.length > 0 && !force) {
    set({ successGetActive: true, error: undefined });
    return;
  }

  set({
    loadingActive: true,
    error: undefined,
    successGetActive: false,
  });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(ACTIVE_ENDPOINT);
    const mapped: EmployeeType[] = mapEmployees(res.data?.data ?? res.data ?? []);
    set({
      activeEmployees: mapped,
      loadingActive: false,
      successGetActive: true,
    });
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      loadingActive: false,
      error: e.message,
      successGetActive: false,
    });
  }
};
