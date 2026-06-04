"use client";

import type { AxiosResponse } from "axios";

import type { Get, Set } from "../types";

import { ExpenseTypeCatalog } from "@/app/configurations/Axios/urls";
import { mapSAPKeys } from "@/app/mappings/sapkeys/sapkeys.mapper";
import type { SAPKey } from "@/app/mappings/sapkeys/sapkeys.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchSAPKeys = async (
  set: Set,
  get: Get,
  force = false,
): Promise<SAPKey[] | null> => {
  if (!force && get().sapKeys.length > 0) {
    return get().sapKeys;
  }

  set({
    loadingSAPKeys: true,
    error: undefined,
    successGetSAPKeys: false,
  });

  try {
    const getFn = requireGateway("get");
    const res: AxiosResponse = await pGet(getFn)(ExpenseTypeCatalog);
    const payload = res.data?.data ?? res.data ?? [];
    const sapKeys = mapSAPKeys(payload);

    set({
      sapKeys,
      loadingSAPKeys: false,
      successGetSAPKeys: true,
    });

    return sapKeys;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      loadingSAPKeys: false,
      successGetSAPKeys: false,
      error: err.message,
    });
    return null;
  }
};
