// src/app/stores/useEmployeesStore/utilities/activateEmployee.ts
import type { Set, Get } from "../types";

import { EmployeesActive } from "@/app/configurations/Axios/urls";
import { mapEmployee } from "@/app/mappings/employees/employee.mapper";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchActiveEmployees } from "./fetchActiveEmployees";
import { fetchEmployees } from "./fetchEmployees";

/**
 * Activate an employee record.
 */
export const activateEmployee = async (
  set: Set,
  get: Get,
  id: string
): Promise<EmployeeType | null> => {
  set({
    activating: true,
    successActivate: false,
    error: undefined,
  });

  try {
    const putFn = requireGateway("put");
    const put = pPut(putFn);
    const res = await put(`${EmployeesActive}/${id}`, {});
    const raw = res.data?.data ?? res.data ?? null;
    const activated = raw ? mapEmployee(raw) : null;

    await Promise.all([
      fetchEmployees(set, get, true),
      fetchActiveEmployees(set, get, true),
    ]);

    const stateAfterFetch = get();
    const currentDetail = stateAfterFetch.employee;
    const nextDetail =
      currentDetail && currentDetail.employee_id === id
        ? activated ??
          stateAfterFetch.employees.find((emp) => emp.employee_id === id)
        : currentDetail;

    set({
      activating: false,
      successActivate: true,
      employee: nextDetail,
    });

    return activated;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      activating: false,
      successActivate: false,
      error: e.message,
    });
    return null;
  }
};
