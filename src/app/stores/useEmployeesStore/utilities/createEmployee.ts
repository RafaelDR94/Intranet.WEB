// src/app/stores/useEmployeesStore/utilities/createEmployee.ts
import type { Set, Get } from "../types";

import { Employees } from "@/app/configurations/Axios/urls";
import { mapEmployee, mapEmployeePost } from "@/app/mappings/employees/employee.mapper";
import type {
  EmployeeType,
  PostEmployees,
} from "@/app/mappings/employees/employee.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPost } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchActiveEmployees } from "./fetchActiveEmployees";
import { fetchEmployees } from "./fetchEmployees";

/**
 * Create a new employee record.
 */
export const createEmployee = async (
  set: Set,
  get: Get,
  payload: PostEmployees
): Promise<EmployeeType | null> => {
  set({
    creating: true,
    successPost: false,
    error: undefined,
  });

  try {
    const postFn = requireGateway("post");
    const post = pPost(postFn, [200, 201]);
    const res = await post(Employees, mapEmployeePost(payload));
    const raw = res.data?.data ?? res.data ?? null;
    const created = raw ? mapEmployee(raw) : null;

    await Promise.all([
      fetchEmployees(set, get, true),
      fetchActiveEmployees(set, get, true),
    ]);

    set({
      creating: false,
      successPost: true,
    });

    return created;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      creating: false,
      successPost: false,
      error: e.message,
    });
    return null;
  }
};
