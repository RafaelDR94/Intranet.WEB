// src/app/stores/useEmployeesStore/utilities/deleteEmployee.ts
import type { Set, Get } from "../types";

import { Employees } from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pDelete } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchActiveEmployees } from "./fetchActiveEmployees";
import { fetchEmployees } from "./fetchEmployees";

/**
 * Delete an employee by id.
 */
export const deleteEmployee = async (
  set: Set,
  get: Get,
  id: string
): Promise<boolean> => {
  set({
    deleting: true,
    successDelete: false,
    error: undefined,
  });

  try {
    const delFn = requireGateway("del");
    const del = pDelete(delFn);
    await del(`${Employees}/${id}`);

    await Promise.all([
      fetchEmployees(set, get, true),
      fetchActiveEmployees(set, get, true),
    ]);

    const current = get().employee;
    set({
      deleting: false,
      successDelete: true,
      employee:
        current && current.employee_id === id ? undefined : current,
    });

    return true;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      deleting: false,
      successDelete: false,
      error: e.message,
    });
    return false;
  }
};
