// src/app/stores/useAccesRequirementStore/utilities/createAccesRequirement.ts
import type { Set, Get } from "../types";

import { CustomAccessControlerAccesRequirement } from "@/app/configurations/Axios/urls";
import { mapAccesRequirement } from "@/app/mappings/accesrequest/accesrequest.mapper";
import type { AccesPost, AccesRequirmentGet } from "@/app/mappings/accesrequest/accesrequest.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPost } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchAccesRequirements } from "./fetchAccesRequirements";

export const createAccesRequirement = async (
  set: Set,
  get: Get,
  payload: AccesPost
): Promise<AccesRequirmentGet | null> => {
  set({ creating: true, successPost: false, error: undefined });
  try {
    const post = pPost(requireGateway("post"), [200, 201]);
    const res = await post(CustomAccessControlerAccesRequirement, payload);
    const raw = res.data?.data ?? res.data ?? null;
    const created = raw ? mapAccesRequirement(raw) : null;

    await fetchAccesRequirements(set, get, true);

    set({ creating: false, successPost: true });
    return created;
  } catch (err) {
    const e = normalizeApiError(err);
    set({ creating: false, successPost: false, error: e.message });
    return null;
  }
};

