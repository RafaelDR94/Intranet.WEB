import type { Get, Set } from "../types";

import { Users } from "@/app/configurations/Axios/urls";
import { mapUser } from "@/app/mappings/users/user.mapper";
import type { UserType } from "@/app/mappings/users/user.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchUserById = async (
  id: string,
  set: Set,
  get: Get,
  force = false
): Promise<UserType | null> => {
  const cached = get().user;
  if (!force && cached && cached.user_id === id) {
    set({ successGetById: true, error: undefined });
    return cached;
  }

  set({ loadingById: true, error: undefined, successGetById: false });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(`${Users}/ById/${id}`);
    const raw = res.data?.data ?? res.data ?? null;
    const user = raw ? mapUser(raw) : null;

    set({
      user: user ?? undefined,
      loadingById: false,
      successGetById: Boolean(user),
    });

    return user;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      loadingById: false,
      successGetById: false,
      error: e.message,
    });
    return null;
  }
};
