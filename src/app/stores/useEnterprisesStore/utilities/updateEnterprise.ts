// src/app/stores/useEnterprisesStore/utilities/updateEnterprise.ts
import type { Set, Get } from "../types";

import { Enterprises } from "@/app/configurations/Axios/urls";
import {
  mapEnterprise,
  mapEnterprisePut,
} from "@/app/mappings/enterprises/enterprises.mapper";
import type {
  Enterprise,
  EnterprisePut,
} from "@/app/mappings/enterprises/enterprises.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchEnterprises } from "./fetchEnterprises";

/**
 * Actualiza una empresa existente.
 */
export const updateEnterprise = async (
  set: Set,
  get: Get,
  payload: EnterprisePut
): Promise<Enterprise | null> => {
  set({
    updating: true,
    successPut: false,
    error: undefined,
  });

  try {
    const put = pPut(requireGateway("put"));
    const res = await put(Enterprises, mapEnterprisePut(payload));
    const raw = res.data?.data ?? res.data ?? null;
    const updated = raw ? mapEnterprise(raw) : null;

    await fetchEnterprises(set, get, true);

    set({
      updating: false,
      successPut: true,
    });

    return updated;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      updating: false,
      successPut: false,
      error: e.message,
    });
    return null;
  }
};

