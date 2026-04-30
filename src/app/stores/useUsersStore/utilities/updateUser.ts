import type { Get, Set } from "../types";

import { Users } from "@/app/configurations/Axios/urls";
import {
  mapUser,
  mapUserPut,
} from "@/app/mappings/users/user.mapper";
import type {
  UpdateUserPayload,
  UserPut,
  UserType,
} from "@/app/mappings/users/user.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchUsers } from "./fetchUsers";

export const updateUser = async (
  set: Set,
  get: Get,
  payload: UpdateUserPayload | UserPut
): Promise<UserType | null> => {
  set({
    updating: true,
    successPut: false,
    error: undefined,
  });

  try {
    const putFn = requireGateway("put");
    const put = pPut(putFn);
    const body = mapUserPut(payload);
    const res = await put(Users, body);
    const raw = res.data?.data ?? res.data ?? null;
    const updated = raw ? mapUser(raw) : null;

    await fetchUsers(set, get, true);

    const state = get();
    const current = state.user;
    const nextDetail =
      current && current.user_id === body.user_id
        ? updated ??
          state.users.find((usr) => usr.user_id === body.user_id)
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
