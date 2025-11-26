// src/app/stores/useEnterprisesStore/utilities/createExternalEnterprise.ts
import type { Set, Get } from "../types";

import { EnterprisesExternal } from "@/app/configurations/Axios/urls";
import {
  mapEnterprise,
  mapExternalEnterprisePost,
} from "@/app/mappings/enterprises/enterprises.mapper";
import type {
  Enterprise,
  ExternalEnterprisePost,
} from "@/app/mappings/enterprises/enterprises.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPost } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchEnterprises } from "./fetchEnterprises";

/**
 * Crea una nueva empresa externa.
 */
export const createExternalEnterprise = async (
  set: Set,
  get: Get,
  payload: ExternalEnterprisePost
): Promise<Enterprise | null> => {
  set({
    creating: true,
    successPost: false,
    error: undefined,
  });

  try {
    const post = pPost(requireGateway("post"), [200, 201]);
    const res = await post(
      `${EnterprisesExternal}?newEnterprise=${payload.newEnterprise}&RFC=${payload.RFC}`,
      mapExternalEnterprisePost(payload)
    );
    const raw = res.data?.data ?? res.data ?? null;
    const created = raw ? mapEnterprise(raw) : null;

    await fetchEnterprises(set, get, true);

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

