// src/app/stores/useExternalPersonsStore/utilities/deleteExternalPerson.ts
import type { Set, Get } from "../types";

import { CustomAccessControler } from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pDelete } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchExternalPersons } from "./fetchExternalPersons";
import { fetchExternalPersonsByEnterprise } from "./fetchExternalPersonsByEnterprise";

export const deleteExternalPerson = async (
  set: Set,
  get: Get,
  id: string
): Promise<boolean> => {
  set({ deleting: true, successDelete: false, error: undefined });
  try {
    const del = pDelete(requireGateway("del"));
    await del(`${CustomAccessControler}/${encodeURIComponent(id)}`);

    const current = get().externalPerson;
    const enterpriseId = get().currentEnterpriseId;

    await Promise.all([
      fetchExternalPersons(set, get, true),
      enterpriseId
        ? fetchExternalPersonsByEnterprise(enterpriseId, set, get, true)
        : Promise.resolve([]),
    ]);

    set({
      deleting: false,
      successDelete: true,
      externalPerson: current && current.id === id ? undefined : current,
    });

    return true;
  } catch (err) {
    const e = normalizeApiError(err);
    set({ deleting: false, successDelete: false, error: e.message });
    return false;
  }
};

