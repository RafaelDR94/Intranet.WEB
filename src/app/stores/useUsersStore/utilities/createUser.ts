import type { Get, Set } from "../types";

import { Users } from "@/app/configurations/Axios/urls";
import {
  mapUser,
  mapUserPost,
} from "@/app/mappings/users/user.mapper";
import type {
  CreateUserPayload,
  UserPost,
  UserType,
} from "@/app/mappings/users/user.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPost } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchUsers } from "./fetchUsers";

export const createUser = async (
  set: Set,
  get: Get,
  payload: CreateUserPayload | UserPost
): Promise<UserType | null> => {
  set({
    creating: true,
    successPost: false,
    error: undefined,
  });

  try {
    const postFn = requireGateway("post");
    const post = pPost(postFn, [200, 201]);
    const res = await post(Users, mapUserPost(payload));
    const raw = res.data?.data ?? res.data ?? null;
    const created = raw ? mapUser(raw) : null;

    await fetchUsers(set, get, true);

    set({
      creating: false,
      successPost: true,
    });

    return created;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      creating: false,
      successPost: false,
      error: e.message,
    });
    return null;
  }
};
