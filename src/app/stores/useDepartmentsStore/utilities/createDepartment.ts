import type { AxiosResponse } from "axios";

import { Departments as DepartmentsUrl } from "@/app/configurations/Axios/urls";
import { mapDepartment, mapDepartmentPost } from "@/app/mappings/department/department.mapper";
import type { DepartmentPost, DepartmentType } from "@/app/mappings/department/department.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPost } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import type { Get, Set } from "../types";
import { fetchDepartments } from "./fetchDepartments";

/**
 * Crea un nuevo departamento.
 */
export const createDepartment = async (
  set: Set,
  get: Get,
  payload: DepartmentPost,
): Promise<DepartmentType | null> => {
  set({ creating: true, successPost: false, error: undefined });

  try {
    const post = pPost(requireGateway("post"), [200, 201]);
    const response: AxiosResponse = await post(
      DepartmentsUrl,
      mapDepartmentPost(payload),
    );
    const raw = response?.data?.data ?? response?.data ?? null;
    const created = raw ? mapDepartment(raw) : null;

    await fetchDepartments(set, get, true);

    set({ creating: false, successPost: true });
    return created;
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({ creating: false, successPost: false, error: normalized.message });
    return null;
  }
};
