"use client";

import type { AxiosResponse } from "axios";

import type { Get, SaveTravelExpenseProgressPayload, Set } from "../types";

import { fetchTravelExpenses } from "./fetchTravelExpenses";

import { BillingTravelExpensesSaveProgress } from "@/app/configurations/Axios/urls";
import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";
import { TravelExpenseMap } from "@/app/mappings/travelExpenses/travelExpenses.mapper";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Saves travel expense draft progress using the consolidated SaveProgress endpoint.
 *
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param payload Travel expense draft progress data.
 * @returns Updated travel expense when available.
 */
export const saveTravelExpenseProgress = async (
  set: Set,
  get: Get,
  payload: SaveTravelExpenseProgressPayload,
): Promise<TravelExpense | null> => {
  set({
    savingProgress: true,
    error: undefined,
    successSaveProgress: false,
  });

  try {
    const put = pPut(requireGateway("put"), [200, 204]);
    const res: AxiosResponse = await put(BillingTravelExpensesSaveProgress, payload);
    const raw = res.data?.data ?? res.data;

    await fetchTravelExpenses(set, get, true);

    const refreshed =
      get().travelExpenses.find((item) => item.id === payload.id_travel_expense) ??
      null;
    const updated =
      raw && typeof raw === "object" && !Array.isArray(raw)
        ? TravelExpenseMap(raw)
        : refreshed;

    set({
      savingProgress: false,
      successSaveProgress: true,
      error: undefined,
    });

    return updated;
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      savingProgress: false,
      successSaveProgress: false,
      error: normalized.message,
    });

    return null;
  }
};
