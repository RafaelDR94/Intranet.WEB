import type { Get, Set } from "../types";

import { UsersRoles } from "@/app/configurations/Axios/urls";
import { mapRolePost, mapUserRole } from "@/app/mappings/users/user.mapper";
import type { RolePost, UserRole } from "@/app/mappings/users/user.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPost } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchRoles } from "./fetchRoles";

export const createRole = async (
  set: Set,
  get: Get,
  payload: RolePost
): Promise<UserRole | null> => {
  set({
    creatingRole: true,
    successPostRole: false,
    error: undefined,
  });

  try {
    const postFn = requireGateway("post");
    const post = pPost(postFn, [200, 201]);
    const res = await post(UsersRoles, mapRolePost(payload));
    const raw = res.data?.data ?? res.data ?? null;
    const created = raw ? mapUserRole(raw) : null;

    await fetchRoles(set, get, true);

    set({
      creatingRole: false,
      successPostRole: true,
    });

    return created;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      creatingRole: false,
      successPostRole: false,
      error: e.message,
    });
    return null;
  }
};
