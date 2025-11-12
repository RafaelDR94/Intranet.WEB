// src/app/stores/useExternalPersonsStore/utilities/updateExternalPerson.ts
import type { Set, Get } from "../types";

import { CustomAccessControler } from "@/app/configurations/Axios/urls";
import {
  mapExternalPerson,
  mapExternalPersonPut,
} from "@/app/mappings/externalperson/externalperson.mapper";
import type {
  ExternalPersonModel,
  ExternalPersonPut,
} from "@/app/mappings/externalperson/externalperson.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchExternalPersons } from "./fetchExternalPersons";
import { fetchExternalPersonsByEnterprise } from "./fetchExternalPersonsByEnterprise";

export const updateExternalPerson = async (
  set: Set,
  get: Get,
  payload: ExternalPersonPut
): Promise<ExternalPersonModel | null> => {
  set({ updating: true, successPut: false, error: undefined });
  try {
    const put = pPut(requireGateway("put"));
    const res = await put(CustomAccessControler, mapExternalPersonPut(payload));
    const raw = res.data?.data ?? res.data ?? null;
    const updated = raw ? mapExternalPerson(raw) : null;

    await Promise.all([
      fetchExternalPersons(set, get, true),
      payload?.id_enterprise
        ? fetchExternalPersonsByEnterprise(payload.id_enterprise, set, get, true)
        : Promise.resolve([]),
    ]);

    set({ updating: false, successPut: true });
    return updated;
  } catch (err) {
    const e = normalizeApiError(err);
    set({ updating: false, successPut: false, error: e.message });
    return null;
  }
};

