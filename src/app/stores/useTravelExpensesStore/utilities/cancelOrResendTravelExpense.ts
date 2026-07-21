"use client";

import type { Get, Set } from "../types";

import { fetchTravelExpenses } from "./fetchTravelExpenses";

import {
  BillingTravelExpensesCancel,
  BillingTravelExpensesResend,
} from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Cancels or resends a travel expense requisition.
 *
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param idTravelExpense Travel expense requisition identifier.
 */
export const cancelOrResendTravelExpense = async (
  set: Set,
  get: Get,
  idTravelExpense: string,
  action: "cancel" | "resend" = "resend",
): Promise<boolean> => {
  set({
    cancelingOrResending: true,
    error: undefined,
    successCancelOrResend: false,
  });

  try {
    const put = pPut(requireGateway("put"), [200, 204]);
    const params = new URLSearchParams({ idTravelExpense });
    const endpoint =
      action === "cancel"
        ? BillingTravelExpensesCancel
        : BillingTravelExpensesResend;

    await put(`${endpoint}?${params.toString()}`, {});
    await fetchTravelExpenses(set, get, true);

    set({
      cancelingOrResending: false,
      successCancelOrResend: true,
    });

    return true;
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      cancelingOrResending: false,
      successCancelOrResend: false,
      error: normalized.message,
    });

    return false;
  }
};
