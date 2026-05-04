import type { Get, Set } from "../types";

import { UsersProfile } from "@/app/configurations/Axios/urls";
import {
  mapUser,
  mapUserProfilePut,
} from "@/app/mappings/users/user.mapper";
import type {
  UpdateUserProfilePayload,
  UserProfilePut,
  UserType,
} from "@/app/mappings/users/user.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchUsers } from "./fetchUsers";

export const updateUserProfile = async (
  set: Set,
  get: Get,
  payload: UpdateUserProfilePayload | UserProfilePut
): Promise<UserType | null> => {
  set({
    updating: true,
    successPut: false,
    error: undefined,
  });

  try {
    const putFn = requireGateway("put");
    const put = pPut(putFn);
    const body = mapUserProfilePut(payload);
    const res = await put(UsersProfile, body);
    const raw = res.data?.data ?? res.data ?? null;
    const updated = raw ? mapUser(raw) : null;

    await fetchUsers(set, get, true);

    const state = get();
    const current = state.user;
    const nextDetail =
      current && current.user_id === body.user_id
        ? updated ??
          state.users.find((user) => user.user_id === body.user_id) ??
          current
        : current;

    set({
      updating: false,
      successPut: true,
      user: nextDetail,
    });

    return updated ?? nextDetail ?? null;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      updating: false,
      successPut: false,
      error: e.message,
    });
    return null;
  }
};
