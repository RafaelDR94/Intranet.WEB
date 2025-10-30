// src/app/stores/employees/utilities/fetchEmployeeById.ts
import type { Get, Set } from "../types";

import { EmployeesById } from "@/app/configurations/Axios/urls";
import { mapEmployee } from "@/app/mappings/employees/employee.mapper";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchEmployeeById = async (
  id: string,
  set: Set,
  get: Get,
  force = false
): Promise<EmployeeType | null> => {
  const cached = get().employee;
  if (!force && cached && cached.employee_id === id) {
    return cached;
  }

  set({ loadingById: true, error: undefined });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(`${EmployeesById}/${id}`);
    const raw = res.data?.data ?? res.data ?? null;
    const mapped = raw ? mapEmployee(raw) : null;

    set({
      employee: mapped ?? undefined,
      loadingById: false,
    });

    return mapped;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      loadingById: false,
      error: e.message,
    });
    return null;
  }
};

