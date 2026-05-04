import type { Get, Set } from "../types";

import { EmployeesWithoutActiveUser } from "@/app/configurations/Axios/urls";
import { mapUserEmployeeSummaries } from "@/app/mappings/users/user.mapper";
import type { UserEmployeeSummary } from "@/app/mappings/users/user.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchEmployeesWithoutActiveUser = async (
  set: Set,
  get: Get,
  force = false
): Promise<UserEmployeeSummary[]> => {
  if (get().employeesWithoutActiveUser.length > 0 && !force) {
    set({ successGetWithoutActiveUser: true, error: undefined });
    return get().employeesWithoutActiveUser;
  }

  set({
    loadingWithoutActiveUser: true,
    error: undefined,
    successGetWithoutActiveUser: false,
  });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(EmployeesWithoutActiveUser);
    const employees = mapUserEmployeeSummaries(res.data?.data ?? res.data ?? []);

    set({
      employeesWithoutActiveUser: employees,
      loadingWithoutActiveUser: false,
      successGetWithoutActiveUser: true,
    });

    return employees;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      loadingWithoutActiveUser: false,
      successGetWithoutActiveUser: false,
      error: e.message,
    });
    return [];
  }
};
