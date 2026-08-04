"use client";

import type { SaveRequisitionRequestProgressPayload, Set } from "../types";

import { BillingRequisitionRequestSaveProgress } from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/** Saves requisition request draft progress without refreshing travel expenses. */
export const saveRequisitionRequestProgress = async (
  set: Set,
  payload: SaveRequisitionRequestProgressPayload,
): Promise<boolean> => {
  set({
    savingProgress: true,
    error: undefined,
    successSaveProgress: false,
  });

  try {
    const put = pPut(requireGateway("put"), [200, 204]);
    await put(BillingRequisitionRequestSaveProgress, payload);

    set({
      savingProgress: false,
      successSaveProgress: true,
      error: undefined,
    });

    return true;
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      savingProgress: false,
      successSaveProgress: false,
      error: normalized.message,
    });

    return false;
  }
};
