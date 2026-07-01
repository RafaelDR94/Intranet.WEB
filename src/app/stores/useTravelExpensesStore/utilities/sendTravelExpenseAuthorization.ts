"use client";

import type { Get, Set } from "../types";

import { fetchTravelExpenses } from "./fetchTravelExpenses";

import { BillingTravelExpensesSendAuthorization } from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPost } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Sends a travel expense request to authorization.
 *
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param idTravelExpense Travel expense identifier.
 * @param idAuthorizer Authorizer employee identifier.
 */
export const sendTravelExpenseAuthorization = async (
  set: Set,
  get: Get,
  idTravelExpense: string,
  idAuthorizer: string,
): Promise<boolean> => {
  set({
    sendingAuthorization: true,
    error: undefined,
    successSendAuthorization: false,
  });

  try {
    const post = pPost(requireGateway("post"));
    const params = new URLSearchParams({
      IdTravelExpense: idTravelExpense,
      IdAuthorizer: idAuthorizer,
    });

    await post(
      `${BillingTravelExpensesSendAuthorization}?${params.toString()}`,
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
