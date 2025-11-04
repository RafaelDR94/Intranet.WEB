import type { Get, Set } from "../types";

import { UsersSignature } from "@/app/configurations/Axios/urls";
import {
  mapUserSignaturePayload,
} from "@/app/mappings/users/user.mapper";
import type { UserSignaturePayload } from "@/app/mappings/users/user.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const updateSignature = async (
  set: Set,
  _get: Get,
  payload: UserSignaturePayload
): Promise<string | null> => {
  set({
    changingSignature: true,
    successChangeSignature: false,
    error: undefined,
  });

  try {
    const putFn = requireGateway("put");
    const put = pPut(putFn);
    const body = mapUserSignaturePayload(payload);
    const res = await put(UsersSignature, body);
    const raw = res.data?.data ?? res.data ?? null;
    const signature =
      typeof raw === "string"
        ? raw
        : raw?.signature ?? body.signature ?? null;

    const targetId = body.idemployee;

    set((state) => {
      const matches = (candidate: typeof state.user) =>
        candidate &&
        (candidate.employee_id === targetId ||
          candidate.idemployee === targetId);

      const nextUsers = state.users.map((user) =>
        matches(user)
          ? {
              ...user,
              signature,
            }
          : user
      );

      const nextUser = matches(state.user)
        ? state.user
          ? { ...state.user, signature }
          : state.user
        : state.user;

      return {
        users: nextUsers,
        user: nextUser,
        changingSignature: false,
        successChangeSignature: true,
      };
    });

    return signature;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      changingSignature: false,
      successChangeSignature: false,
      error: e.message,
    });
    return null;
  }
};
