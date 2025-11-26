// src/app/stores/useExternalPersonsStore/utilities/fetchExternalPersonById.ts
import type { Set, Get } from "../types";

import { CustomAccessControlerById } from "@/app/configurations/Axios/urls";
import { mapExternalPerson } from "@/app/mappings/externalperson/externalperson.mapper";
import type { ExternalPersonModel } from "@/app/mappings/externalperson/externalperson.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Obtiene el detalle por ID.
 */
export const fetchExternalPersonById = async (
  id: string,
  set: Set,
  get: Get,
  force = false
): Promise<ExternalPersonModel | null> => {
  const current = get().externalPerson;
  if (current && current.id === id && !force) {
    set({ successGetById: true, error: undefined });
    return current;
  }

  set({ loadingById: true, successGetById: false, error: undefined });

  try {
    const url = `${CustomAccessControlerById}/${encodeURIComponent(id)}`;
    const res = await pGet(requireGateway("get"))(url);
    const raw = res.data?.data ?? res.data ?? null;
    const mapped = raw ? mapExternalPerson(raw) : null;
    set({ externalPerson: mapped ?? undefined, loadingById: false, successGetById: true });
    return mapped;
  } catch (err) {
    const e = normalizeApiError(err);
    set({ loadingById: false, successGetById: false, error: e.message });
    return null;
  }
};

