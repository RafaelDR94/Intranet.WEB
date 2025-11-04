// src/app/stores/useEmployeesStore/utilities/updateEmployee.ts
import type { UpdateEmployeePayload, Set, Get } from "../types";

import { Employees } from "@/app/configurations/Axios/urls";
import { mapEmployee, mapEmployeePut } from "@/app/mappings/employees/employee.mapper";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";


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
