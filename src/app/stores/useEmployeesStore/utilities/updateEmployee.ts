// src/app/stores/useEmployeesStore/utilities/updateEmployee.ts
import type { UpdateEmployeePayload, Set, Get } from "../types";

import { Employees } from "@/app/configurations/Axios/urls";
import { mapEmployee, mapEmployeePut } from "@/app/mappings/employees/employee.mapper";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchActiveEmployees } from "./fetchActiveEmployees";
import { fetchEmployees } from "./fetchEmployees";
import { fetchEmployeesByDepartment } from "./fetchEmployeesByDepartment";


/**
 * Update an existing employee.
 */
export const updateEmployee = async (
  set: Set,
  get: Get,
  payload: UpdateEmployeePayload
): Promise<EmployeeType | null> => {
  set({
    updating: true,
    successPut: false,
    error: undefined,
  });

  try {
    const putFn = requireGateway("put");
    const put = pPut(putFn);
    const body = mapEmployeePut(payload);
    const res = await put(Employees, body);
    const raw = res.data?.data ?? res.data ?? null;
    const updated = raw ? mapEmployee(raw) : null;

    const cachedDepartmentId = get().departmentEmployeesDepartmentId;
    const targetDepartmentId = payload.department_id;
    const departmentsToRefresh = Array.from(
      new Set([cachedDepartmentId, targetDepartmentId].filter(Boolean) as string[]),
    );

    await Promise.all([
      fetchEmployees(set, get, true),
      fetchActiveEmployees(set, get, true),
      ...departmentsToRefresh.map((departmentId) =>
        fetchEmployeesByDepartment(departmentId, set, get, true),
      ),
    ]);

    set({
      updating: false,
      successPut: true,
    });

    return updated;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      updating: false,
      successPut: false,
      error: e.message,
    });
    return null;
  }
};
