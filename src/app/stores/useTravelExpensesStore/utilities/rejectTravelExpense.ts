"use client";

import type { Get, RejectTravelExpensePayload, Set } from "../types";

import { fetchTravelExpenses } from "./fetchTravelExpenses";

import { BillingTravelExpensesReject } from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Rejects a travel expense requisition.
 *
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param payload Rejection data.
 */
export const rejectTravelExpense = async (
  set: Set,
  get: Get,
  payload: RejectTravelExpensePayload
): Promise<boolean> => {
  set({
    rejecting: true,
    error: undefined,
    successReject: false,
  });

  try {
    const put = pPut(requireGateway("put"), [200, 204]);
    const params = new URLSearchParams({
      idTravelExpense: payload.idTravelExpense,
      comment: payload.comment,
    });

    await put(`${BillingTravelExpensesReject}?${params.toString()}`, {});
    await fetchTravelExpenses(set, get, true);

    set({
      rejecting: false,
      successReject: true,
    });

    return true;
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      rejecting: false,
      successReject: false,
      error: normalized.message,
    });

    return false;
  }
};
