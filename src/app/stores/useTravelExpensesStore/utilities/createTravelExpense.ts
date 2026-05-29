"use client";

import type { AxiosResponse } from "axios";

import type { CreateTravelExpensePayload, Get, Set } from "../types";

import { fetchTravelExpenses } from "./fetchTravelExpenses";

import { BillingTravelExpenses } from "@/app/configurations/Axios/urls";
import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";
import { TravelExpenseMap } from "@/app/mappings/travelExpenses/travelExpenses.mapper";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPost } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Creates a travel expense requisition.
 *
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param payload Travel expense request data.
 */
export const createTravelExpense = async (
  set: Set,
  get: Get,
  payload: CreateTravelExpensePayload,
): Promise<TravelExpense | null> => {
  set({
    creating: true,
    error: undefined,
    successPost: false,
  });

  try {
    const post = pPost(requireGateway("post"), [200, 201]);
    const res: AxiosResponse = await post(BillingTravelExpenses, payload);
    const raw = res.data?.data ?? res.data;
    const created = raw ? TravelExpenseMap(raw) : null;

    await fetchTravelExpenses(set, get, true);

    set({
      creating: false,
      successPost: true,
      error: undefined,
    });

    return created;
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      creating: false,
      successPost: false,
      error: normalized.message,
    });

    return null;
  }
};
