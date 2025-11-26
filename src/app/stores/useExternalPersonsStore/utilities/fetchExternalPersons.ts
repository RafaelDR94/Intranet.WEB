// src/app/stores/useExternalPersonsStore/utilities/fetchExternalPersons.ts
import type { Set, Get } from "../types";

import { CustomAccessControler } from "@/app/configurations/Axios/urls";
import {
  mapExternalPersons,
} from "@/app/mappings/externalperson/externalperson.mapper";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Obtiene el listado general de personal externo.
 */
export const fetchExternalPersons = async (
  set: Set,
  get: Get,
  force = false
): Promise<void> => {
  if (get().externalPersons.length > 0 && !force) {
    set({ successGet: true, error: undefined });
    return;
  }

  set({ loading: true, successGet: false, error: undefined });

  try {
    const res = await pGet(requireGateway("get"))(CustomAccessControler);
    const mapped = mapExternalPersons(res.data?.data ?? res.data ?? []);
    set({ externalPersons: mapped, loading: false, successGet: true });
  } catch (err) {
    const e = normalizeApiError(err);
    set({ loading: false, successGet: false, error: e.message });
  }
};

