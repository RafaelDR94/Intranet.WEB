"use client";

import type { AxiosResponse } from "axios";

import type { Get, Set } from "../types";

import { ExpenseTypeCatalog } from "@/app/configurations/Axios/urls";
import {
  mapSAPKey,
  mapSAPKeyPost,
} from "@/app/mappings/sapkeys/sapkeys.mapper";
import type { SAPKey, SAPKeyPost } from "@/app/mappings/sapkeys/sapkeys.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPost } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchSAPKeys } from "./fetchSAPKeys";

export const createSAPKey = async (
  set: Set,
  get: Get,
  payload: SAPKeyPost,
): Promise<SAPKey | null> => {
  set({
    creatingSAPKey: true,
    error: undefined,
    successCreateSAPKey: false,
  });

  try {
    const post = pPost(requireGateway("post"), [200, 201]);
    const res: AxiosResponse = await post(
      ExpenseTypeCatalog,
      mapSAPKeyPost(payload),
    );
    const raw = res.data?.data ?? res.data ?? null;

    await fetchSAPKeys(set, get, true);

    const created =
      raw && typeof raw === "object"
        ? mapSAPKey(raw)
        : (get().sapKeys.find(
            (item) =>
              item.internalKey === payload.internalKey &&
              item.satKey === payload.satKey,
          ) ?? null);

    set({
      creatingSAPKey: false,
      successCreateSAPKey: true,
      sapKey: created ?? undefined,
    });

    return created;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      creatingSAPKey: false,
      successCreateSAPKey: false,
      error: err.message,
    });
    return null;
  }
};
