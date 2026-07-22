"use client";

import type { AxiosResponse } from "axios";

import type { Set } from "../types";

import { BillingRequisitionRequestById } from "@/app/configurations/Axios/urls";
import { TravelExpenseMap } from "@/app/mappings/travelExpenses/travelExpenses.mapper";
import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Fetches one requisition request detail and stores its nested travel expense.
 *
 * @param set Zustand setter.
 * @param id Requisition request identifier.
 */
export const fetchRequisitionRequestById = async (
  set: Set,
  id: string,
): Promise<TravelExpense | null> => {
  if (!id) return null;

  set({
    loadingRequisitionRequestDetail: true,
    currentRequisitionRequest: undefined,
    error: undefined,
  });

  try {
    const getReq = pGet(requireGateway("get"));
    const params = new URLSearchParams({ id });
    const res: AxiosResponse = await getReq(
      `${BillingRequisitionRequestById}?${params.toString()}`,
    );
    const record = res.data?.data;
    const rawTravelExpense =
      record && typeof record === "object"
        ? (record as Record<string, unknown>).travel_expense
        : undefined;
    const mapped = TravelExpenseMap(
      rawTravelExpense && typeof rawTravelExpense === "object"
        ? {
            ...(record as Record<string, unknown>),
            ...(rawTravelExpense as Record<string, unknown>),
            creditor_number:
              (record as Record<string, unknown>).creditor_number ??
              (rawTravelExpense as Record<string, unknown>).creditor_number,
            client_code:
              (record as Record<string, unknown>).client_code ??
              (rawTravelExpense as Record<string, unknown>).client_code,
            id_user:
              (record as Record<string, unknown>).id_user ??
              (rawTravelExpense as Record<string, unknown>).id_user,
          }
        : record,
    );

    set({
      currentRequisitionRequest: mapped,
      loadingRequisitionRequestDetail: false,
    });

    return mapped;
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      error: normalized.message,
      currentRequisitionRequest: undefined,
      loadingRequisitionRequestDetail: false,
    });

    return null;
  }
};
