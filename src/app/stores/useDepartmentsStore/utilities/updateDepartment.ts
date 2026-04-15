import type { AxiosResponse } from "axios";

import { Departments as DepartmentsUrl } from "@/app/configurations/Axios/urls";
import {
  mapDepartment,
  mapDepartmentPut,
} from "@/app/mappings/department/department.mapper";
import type {
  DepartmentPut,
  DepartmentType,
} from "@/app/mappings/department/department.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import type { Get, Set } from "../types";
import { fetchDepartments } from "./fetchDepartments";

/**
 * Actualiza un departamento existente.
 */
export const updateDepartment = async (
  set: Set,
  get: Get,
  payload: DepartmentPut,
): Promise<DepartmentType | null> => {
  set({ updating: true, successPut: false, error: undefined });

  try {
    const put = pPut(requireGateway("put"), [200, 204]);
    const response: AxiosResponse = await put(
      DepartmentsUrl,
      mapDepartmentPut(payload),
    );
    const raw = response?.data?.data ?? response?.data ?? null;
    const updated = raw ? mapDepartment(raw) : null;

    await fetchDepartments(set, get, true);

    set({ updating: false, successPut: true });
    return updated;
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({ updating: false, successPut: false, error: normalized.message });
    return null;
  }
};
