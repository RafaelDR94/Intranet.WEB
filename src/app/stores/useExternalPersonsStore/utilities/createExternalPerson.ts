// src/app/stores/useExternalPersonsStore/utilities/createExternalPerson.ts
import type { Set, Get } from "../types";

import { CustomAccessControler } from "@/app/configurations/Axios/urls";
import {
  mapExternalPerson,
  mapExternalPersonPost,
} from "@/app/mappings/externalperson/externalperson.mapper";
import type {
  ExternalPersonModel,
  ExternalPersonPost,
} from "@/app/mappings/externalperson/externalperson.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPost } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchExternalPersonsByEnterprise } from "./fetchExternalPersonsByEnterprise";

export const createExternalPerson = async (
  set: Set,
  get: Get,
  payload: ExternalPersonPost
): Promise<ExternalPersonModel | null> => {
  set({ creating: true, successPost: false, error: undefined });
  try {
    const post = pPost(requireGateway("post"), [200, 201]);
    const res = await post(CustomAccessControler, mapExternalPersonPost(payload));
    const raw = res.data?.data ?? res.data ?? null;
    const created = raw ? mapExternalPerson(raw) : null;
    fetchExternalPersonsByEnterprise(payload.id_enterprise, set, get, true);
    // await Promise.all([
    //   fetchExternalPersons(set, get, true),
    //   payload?.id_enterprise
    //     ? fetchExternalPersonsByEnterprise(payload.id_enterprise, set, get, true)
    //     : Promise.resolve([]),
    // ]);

    set({ creating: false, successPost: true });
    return created;
  } catch (err) {
    const e = normalizeApiError(err);
    set({ creating: false, successPost: false, error: e.message });
    return null;
  }
};

