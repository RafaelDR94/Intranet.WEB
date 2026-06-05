"use client";

import type { AxiosResponse } from "axios";

import type { Get, Set } from "../types";

import { ExpenseTypeCatalog } from "@/app/configurations/Axios/urls";
import { mapSAPKey, mapSAPKeyPut } from "@/app/mappings/sapkeys/sapkeys.mapper";
import type { SAPKey, SAPKeyPut } from "@/app/mappings/sapkeys/sapkeys.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchSAPKeys } from "./fetchSAPKeys";

export const updateSAPKey = async (
  set: Set,
  get: Get,
  payload: SAPKeyPut,
): Promise<SAPKey | null> => {
  set({
    updatingSAPKey: true,
    error: undefined,
    successUpdateSAPKey: false,
  });

  try {
    const put = pPut(requireGateway("put"), [200, 204]);
    const res: AxiosResponse = await put(
      ExpenseTypeCatalog,
      mapSAPKeyPut(payload),
    );
    const raw = res.data?.data ?? res.data ?? null;

    await fetchSAPKeys(set, get, true);

    const updated =
      raw && typeof raw === "object"
        ? mapSAPKey(raw)
        : (get().sapKeys.find((item) => item.id === payload.id) ?? null);

    set({
      updatingSAPKey: false,
      successUpdateSAPKey: true,
      sapKey: updated ?? undefined,
    });

    return updated;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      updatingSAPKey: false,
      successUpdateSAPKey: false,
      error: err.message,
    });
    return null;
  }
};
