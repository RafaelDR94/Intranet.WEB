import { Departments as DepartmentsUrl } from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pDelete } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import type { Get, Set } from "../types";
import { fetchDepartments } from "./fetchDepartments";

/**
 * Elimina un departamento por id.
 */
export const deleteDepartment = async (
  set: Set,
  get: Get,
  id: string,
): Promise<boolean> => {
  set({ updating: true, successPut: false, error: undefined });

  try {
    const target = `${DepartmentsUrl}/${id}`;
    const del = pDelete(requireGateway("del"), [200, 204]);
    await del(target);

    await fetchDepartments(set, get, true);

    set({ updating: false, successPut: true });
    return true;
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({ updating: false, successPut: false, error: normalized.message });
    return false;
  }
};
