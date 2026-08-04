"use client";

import type {
  ResendRequisitionRequestAuthorizationPayload,
  Set,
} from "../types";

import { BillingTravelExpensesRequisitionRequestResendAuthorization } from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/** Resends a requisition request to authorization without refreshing travel expenses. */
export const resendRequisitionRequestAuthorization = async (
  set: Set,
  payload: ResendRequisitionRequestAuthorizationPayload,
): Promise<boolean> => {
  set({
    sendingAuthorization: true,
    error: undefined,
    successSendAuthorization: false,
  });

  try {
    const put = pPut(requireGateway("put"), [200, 204]);
    await put(
      BillingTravelExpensesRequisitionRequestResendAuthorization,
      payload,
    );

    set({
      sendingAuthorization: false,
      successSendAuthorization: true,
      error: undefined,
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
