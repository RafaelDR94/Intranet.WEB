import type { Get, Set } from "../types";

import { Users } from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pDelete } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchUsers } from "./fetchUsers";

export const deleteUser = async (
  set: Set,
  get: Get,
  id: string
): Promise<boolean> => {
  set({
    deleting: true,
    successDelete: false,
    error: undefined,
  });

  try {
    const delFn = requireGateway("del");
    const del = pDelete(delFn);
    await del(`${Users}/${id}`);

    await fetchUsers(set, get, true);

    const current = get().user;
    set({
      deleting: false,
      successDelete: true,
      user: current && current.user_id === id ? undefined : current,
    });

    return true;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      deleting: false,
      successDelete: false,
      error: e.message,
    });
    return false;
  }
};
