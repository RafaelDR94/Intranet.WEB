import type { Get, Set } from "../types";

import { EmployeesActiveUsers } from "@/app/configurations/Axios/urls";
import { mapUserEmployeeSummaries } from "@/app/mappings/users/user.mapper";
import type { UserEmployeeSummary } from "@/app/mappings/users/user.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchEmployeesWithActiveUser = async (
  set: Set,
  get: Get,
  force = false
): Promise<UserEmployeeSummary[]> => {
  if (get().employeesWithActiveUser.length > 0 && !force) {
    set({ successGetWithActiveUser: true, error: undefined });
    return get().employeesWithActiveUser;
  }

  set({
    loadingWithActiveUser: true,
    error: undefined,
    successGetWithActiveUser: false,
  });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(EmployeesActiveUsers);
    const employees = mapUserEmployeeSummaries(res.data?.data ?? res.data ?? []);

    set({
      employeesWithActiveUser: employees,
      loadingWithActiveUser: false,
      successGetWithActiveUser: true,
    });

    return employees;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      loadingWithActiveUser: false,
      successGetWithActiveUser: false,
      error: e.message,
    });
    return [];
  }
};
