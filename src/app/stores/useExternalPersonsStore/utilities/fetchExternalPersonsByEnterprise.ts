// src/app/stores/useExternalPersonsStore/utilities/fetchExternalPersonsByEnterprise.ts
import type { Set, Get } from "../types";

import { CustomAccessControlerByEnterprise } from "@/app/configurations/Axios/urls";
import { mapExternalPersons } from "@/app/mappings/externalperson/externalperson.mapper";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Obtiene el personal externo por empresa.
 */
export const fetchExternalPersonsByEnterprise = async (
  enterpriseId: string,
  set: Set,
  get: Get,
  force = false
) => {
  const cache = get().externalPersonsByEnterprise[enterpriseId];
  if (cache && cache.length > 0 && !force) {
    set({
      successGetByEnterprise: true,
      loadingByEnterprise: false,
      externalPersons: cache,
      currentEnterpriseId: enterpriseId,
    });
    return cache;
  }

  set({
    loadingByEnterprise: true,
    successGetByEnterprise: false,
    error: undefined,
    currentEnterpriseId: enterpriseId,
  });

  try {
    const url = `${CustomAccessControlerByEnterprise}/${encodeURIComponent(
      enterpriseId
    )}`;
    const res = await pGet(requireGateway("get"))(url);
    const mapped = mapExternalPersons(res.data?.data ?? res.data ?? []);

    const state = get();
    set({
      loadingByEnterprise: false,
      successGetByEnterprise: true,
      externalPersons: mapped,
      externalPersonsByEnterprise: {
        ...state.externalPersonsByEnterprise,
        [enterpriseId]: mapped,
      },
    });

    return mapped;
  } catch (err) {
    const e = normalizeApiError(err);
    set({ loadingByEnterprise: false, successGetByEnterprise: false, error: e.message });
    return [];
  }
};

