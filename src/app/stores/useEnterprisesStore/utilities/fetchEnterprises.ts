// src/app/stores/useEnterprisesStore/utilities/fetchEnterprises.ts
import type { Set, Get } from "../types";

import { Enterprises } from "@/app/configurations/Axios/urls";
import { mapEnterprises } from "@/app/mappings/enterprises/enterprises.mapper";
import type { Enterprise } from "@/app/mappings/enterprises/enterprises.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Obtiene el catálogo de empresas desde el backend.
 */
export const fetchEnterprises = async (
  set: Set,
  get: Get,
  force = false
) => {
  if (get().enterprises.length > 0 && !force) {
    set({ successGetEnterprises: true, error: undefined });
    return;
  }

  set({
    loadingEnterprises: true,
    error: undefined,
    successGetEnterprises: false,
  });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(Enterprises);
    const mapped: Enterprise[] = mapEnterprises(res.data?.data ?? res.data ?? []);

    set({
      enterprises: mapped,
      loadingEnterprises: false,
      successGetEnterprises: true,
    });
  } catch (err) {
    const normalized = normalizeApiError(err);
    set({
      loadingEnterprises: false,
      successGetEnterprises: false,
      error: normalized.message,
    });
  }
};
