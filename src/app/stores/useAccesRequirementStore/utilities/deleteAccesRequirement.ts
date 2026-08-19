// src/app/stores/useAccesRequirementStore/utilities/deleteAccesRequirement.ts
import type { Set, Get } from "../types";

import { CustomAccessControlerAccesRequirement } from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pDelete } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchAccesRequirements } from "./fetchAccesRequirements";

export const deleteAccesRequirement = async (
  set: Set,
  get: Get,
  id: string
): Promise<boolean> => {
  set({ deleting: true, successDelete: false, error: undefined });
  try {
    const del = pDelete(requireGateway("del"));
    await del(`${CustomAccessControlerAccesRequirement}/ById/${encodeURIComponent(id)}`);

    const current = get().current;

    await fetchAccesRequirements(set, get, true);

    set({
      deleting: false,
      successDelete: true,
      current: current && current.id === id ? undefined : current,
    });

    return true;
  } catch (err) {
    const e = normalizeApiError(err);
    set({ deleting: false, successDelete: false, error: e.message });
    return false;
  }
};

