"use client";

import type { AxiosResponse } from "axios";

import type { Get, Set, UpdateTravelExpensePayload } from "../types";

import { fetchTravelExpenses } from "./fetchTravelExpenses";

import { BillingTravelExpenses } from "@/app/configurations/Axios/urls";
import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";
import { TravelExpenseMap } from "@/app/mappings/travelExpenses/travelExpenses.mapper";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Updates a travel expense requisition.
 *
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param payload Travel expense update data.
 */
export const updateTravelExpense = async (
  set: Set,
  get: Get,
  payload: UpdateTravelExpensePayload,
): Promise<TravelExpense | null> => {
  set({
    updating: true,
    error: undefined,
    successPut: false,
  });

  try {
    const put = pPut(requireGateway("put"), [200, 204]);
    const res: AxiosResponse = await put(BillingTravelExpenses, payload);
    const raw = res.data?.data ?? res.data;
    const updated = raw ? TravelExpenseMap(raw) : null;

    await fetchTravelExpenses(set, get, true);

    set({
      updating: false,
      successPut: true,
      error: undefined,
    });

    return updated;
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      updating: false,
      successPut: false,
      error: normalized.message,
    });

    return null;
  }
};
