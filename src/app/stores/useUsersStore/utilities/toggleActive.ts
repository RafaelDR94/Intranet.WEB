import type { Get, Set } from "../types";

import { Users } from "@/app/configurations/Axios/urls";
import {
  mapToggleUserActivePayload,
} from "@/app/mappings/users/user.mapper";
import type { ToggleUserActivePayload } from "@/app/mappings/users/user.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchUsers } from "./fetchUsers";

export const toggleActive = async (
  set: Set,
  get: Get,
  payload: ToggleUserActivePayload
): Promise<boolean> => {
  set({
    togglingActive: true,
    successToggleActive: false,
    error: undefined,
  });

  try {
    const putFn = requireGateway("put");
    const put = pPut(putFn);
    const body = mapToggleUserActivePayload(payload);
    const endpoint = `${Users}/UserDesable?id=${body.id}&isActive=${body.isActive}`;
    await put(endpoint, {});

    await fetchUsers(set, get, true);

    const state = get();
    const current = state.user;
    const nextDetail =
      current && current.user_id === body.id
        ? state.users.find((usr) => usr.user_id === body.id) ?? current
        : current;

    set({
      user: nextDetail,
      togglingActive: false,
      successToggleActive: true,
    });

    return true;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      togglingActive: false,
      successToggleActive: false,
      error: e.message,
    });
    return false;
  }
};
