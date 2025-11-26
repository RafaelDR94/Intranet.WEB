// src/app/stores/useAccesRequirementStore/utilities/fetchAccesRequirementById.ts
import type { Set, Get } from "../types";

import { CustomAccessControlerAccesRequirement } from "@/app/configurations/Axios/urls";
import { mapAccesRequirement } from "@/app/mappings/accesrequest/accesrequest.mapper";
import type { AccesRequirmentGet } from "@/app/mappings/accesrequest/accesrequest.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchAccesRequirementById = async (
  id: string,
  set: Set,
  get: Get,
  force = false
): Promise<AccesRequirmentGet | null> => {
  const cached = get().accesRequirements.find((x) => x.id === id);
  if (cached && !force) {
    set({ current: cached, successGetById: true, error: undefined });
    return cached;
  }

  set({ loadingById: true, successGetById: false, error: undefined });
  try {
    const res = await pGet(requireGateway("get"))(
      `${CustomAccessControlerAccesRequirement}/${encodeURIComponent(id)}`
    );
    const raw = res.data?.data ?? res.data ?? null;
    const mapped = raw ? mapAccesRequirement(raw) : null;
    set({ current: mapped ?? undefined, loadingById: false, successGetById: true });
    return mapped;
  } catch (err) {
    const e = normalizeApiError(err);
    set({ loadingById: false, successGetById: false, error: e.message });
    return null;
  }
};

