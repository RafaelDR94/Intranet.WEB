"use client";

import type { Get, Set } from "../types";

import { fetchTravelExpenses } from "./fetchTravelExpenses";

import { BillingRequisitionRequestSendAuthorization } from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Sends a generated requisition request to authorization.
 *
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param idRequisitionRequest Requisition request identifier.
 */
export const sendRequisitionRequestAuthorization = async (
  set: Set,
  get: Get,
  idRequisitionRequest: string,
): Promise<boolean> => {
  set({
    sendingAuthorization: true,
    error: undefined,
    successSendAuthorization: false,
  });

  try {
    const put = pPut(requireGateway("put"), [200, 204]);
    const params = new URLSearchParams({ idRequisitionRequest });

    await put(
      `${BillingRequisitionRequestSendAuthorization}?${params.toString()}`,
      {},
    );
    await fetchTravelExpenses(set, get, true);

    set({
      sendingAuthorization: false,
      successSendAuthorization: true,
    });

    return true;
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      sendingAuthorization: false,
      successSendAuthorization: false,
      error: normalized.message,
    });

    return false;
  }
};
