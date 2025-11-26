// src/app/stores/useAccesRequirementStore/utilities/updateAccesRequirement.ts
import type { Set, Get } from "../types";

import { CustomAccessControlerAccesRequirement } from "@/app/configurations/Axios/urls";
import { mapAccesRequirement } from "@/app/mappings/accesrequest/accesrequest.mapper";
import type { AccesPut, AccesRequirmentGet } from "@/app/mappings/accesrequest/accesrequest.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";
import {fetchAccesRequirementById} from "./fetchAccesRequirementById";
export const updateAccesRequirement = async (
  set: Set,
  get: Get,
  payload: AccesPut
): Promise<AccesRequirmentGet | null> => {
  set({ updating: true, successPut: false, error: undefined });
  try {
    const put = pPut(requireGateway("put"));
    const res = await put(CustomAccessControlerAccesRequirement, payload);
    const raw = res.data?.data ?? res.data ?? null;
    const updated = raw ? mapAccesRequirement(raw) : null;
    await fetchAccesRequirementById( payload.id,set, get,true);

    set({ updating: false, successPut: true });
    return updated;
  } catch (err) {
    const e = normalizeApiError(err);
    set({ updating: false, successPut: false, error: e.message });
    return null;
  }
};

