import type { Get, Set } from "../types";

import { Users } from "@/app/configurations/Axios/urls";
import { mapUsers } from "@/app/mappings/users/user.mapper";
import type { UserType } from "@/app/mappings/users/user.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchUsers = async (set: Set, get: Get, force = false) => {
  if (get().users.length > 0 && !force) {
    set({ successGet: true, error: undefined });
    return;
  }

  set({ loading: true, error: undefined, successGet: false });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(Users);
    const raw = res.data?.data ?? res.data ?? [];
    const users: UserType[] = mapUsers(raw);

    set({
      users,
      loading: false,
      successGet: true,
    });
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      loading: false,
      successGet: false,
      error: e.message,
    });
  }
};
