"use client";

import type { Get, Set } from "../types";

import { fetchTravelExpenses } from "./fetchTravelExpenses";

import { BillingTravelExpensesApprove } from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Approves a travel expense requisition.
 *
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param idTravelExpense Travel expense requisition identifier.
 */
export const approveTravelExpense = async (
  set: Set,
  get: Get,
  idTravelExpense: string
): Promise<boolean> => {
  set({
    approving: true,
    error: undefined,
    successApprove: false,
  });

  try {
    const put = pPut(requireGateway("put"), [200, 204]);
    const params = new URLSearchParams({ idTravelExpense });

    await put(`${BillingTravelExpensesApprove}?${params.toString()}`, {});
    await fetchTravelExpenses(set, get, true);

    set({
      approving: false,
      successApprove: true,
    });

    return true;
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      approving: false,
      successApprove: false,
      error: normalized.message,
    });

    return false;
  }
};
