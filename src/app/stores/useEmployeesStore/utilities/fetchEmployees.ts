// src/app/stores/useEmployeesStore/utilities/fetchEmployees.ts
import type { Set, Get } from "../types";

import { mapEmployees } from "@/app/mappings/employees/employee.mapper";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";
import { buildEmployeesUrl, type FetchEmployeesOptions } from "./buildEmployeesUrl";

/**
 * Fetch employees from backend and store them.
 *
 * @param set Zustand set function.
 * @param get Zustand get function.
 * @param force Ignore local cache when true.
 */
export const fetchEmployees = async (
  set: Set,
  get: Get,
  force = false,
  options: FetchEmployeesOptions = { isActive: true },
) => {
  if(get().loading) return;
  if (get().employees.length > 0 && !force ) {
    set({ successGet: true, error: undefined });
    return;
  }

  set({ loading: true, error: undefined, successGet: false });
  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(buildEmployeesUrl(options));
    const mapped: EmployeeType[] = mapEmployees(res.data?.data ?? res.data ?? []);
    set({
      employees: mapped,
      loading: false,
      successGet: true,
    });
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      error: e.message,
      loading: false,
      successGet: false,
    });
  }
};
