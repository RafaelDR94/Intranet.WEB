import type { Get, Set } from "../types";

import { UsersRoles } from "@/app/configurations/Axios/urls";
import { mapUserRoles } from "@/app/mappings/users/user.mapper";
import type { UserRole } from "@/app/mappings/users/user.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchRoles = async (
  set: Set,
  get: Get,
  force = false
): Promise<UserRole[]> => {
  if (get().roles.length > 0 && !force) {
    set({ successGetRoles: true, error: undefined });
    return get().roles;
  }

  set({
    loadingRoles: true,
    successGetRoles: false,
    error: undefined,
  });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(UsersRoles);
    const raw = res.data?.data ?? res.data ?? [];
    const roles = mapUserRoles(raw);

    set({
      roles,
      loadingRoles: false,
      successGetRoles: true,
    });

    return roles;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      loadingRoles: false,
      successGetRoles: false,
      error: e.message,
    });
    return [];
  }
};
