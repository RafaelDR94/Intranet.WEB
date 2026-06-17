"use client";

import type { AxiosResponse } from "axios";

import type { Get, Set } from "../types";

import { ExpenseTypeCatalogById } from "@/app/configurations/Axios/urls";
import { mapSAPKey } from "@/app/mappings/sapkeys/sapkeys.mapper";
import type { SAPKey } from "@/app/mappings/sapkeys/sapkeys.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchSAPKeyById = async (
  id: string,
  set: Set,
  get: Get,
  force = false,
): Promise<SAPKey | null> => {
  const cached = get().sapKey;
  if (!force && cached?.id === id) {
    return cached;
  }

  set({
    loadingSAPKey: true,
    error: undefined,
    successGetSAPKey: false,
  });

  try {
    const getFn = requireGateway("get");
    const res: AxiosResponse = await pGet(getFn)(
      `${ExpenseTypeCatalogById}/${id}`,
    );
    const payload = res.data?.data ?? res.data ?? {};
    const raw = Array.isArray(payload) ? (payload[0] ?? {}) : payload;
    const sapKey = mapSAPKey(raw);

    set((state) => ({
      sapKey,
      sapKeys: state.sapKeys.some((item) => item.id === sapKey.id)
        ? state.sapKeys.map((item) => (item.id === sapKey.id ? sapKey : item))
        : [...state.sapKeys, sapKey],
      loadingSAPKey: false,
      successGetSAPKey: true,
    }));

    return sapKey;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      loadingSAPKey: false,
      successGetSAPKey: false,
      error: err.message,
    });
    return null;
  }
};
