// src/app/stores/useAccesRequirementStore/utilities/fetchAccesRequirements.ts
import type { Set, Get } from "../types";

import { CustomAccessControlerAccesRequirement } from "@/app/configurations/Axios/urls";
import {
  mapAccesRequirements,
} from "@/app/mappings/accesrequest/accesrequest.mapper";
import type { AccesRequirmentGet } from "@/app/mappings/accesrequest/accesrequest.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchAccesRequirements = async (
  set: Set,
  get: Get,
  force = false
): Promise<AccesRequirmentGet[] | null> => {
  if (get().accesRequirements.length > 0 && !force) {
    set({ successGet: true, error: undefined });
    return get().accesRequirements;
  }

  set({ loading: true, successGet: false, error: undefined });
  try {
    const res = await pGet(requireGateway("get"))(
      CustomAccessControlerAccesRequirement
    );
    const list = mapAccesRequirements(res.data?.data ?? res.data ?? []);
    set({ accesRequirements: list, loading: false, successGet: true });
    return list;
  } catch (err) {
    const e = normalizeApiError(err);
    set({ loading: false, successGet: false, error: e.message });
    return null;
  }
};

