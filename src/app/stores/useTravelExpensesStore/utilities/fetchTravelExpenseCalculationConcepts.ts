"use client";

import type { AxiosResponse } from "axios";

import type { Get, Set } from "../types";

import { BillingTravelExpensesCalculationConcepts } from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Fetches travel expense calculation concepts catalog.
 *
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param force Forces a refresh when true.
 * @returns Travel expense calculation concepts.
 */
export const fetchTravelExpenseCalculationConcepts = async (
  set: Set,
  get: Get,
  force = false,
): Promise<string[]> => {
  if (get().travelExpenseCalculationConcepts.length > 0 && !force) {
    set({
      loadingCalculationConcepts: false,
      error: undefined,
      successGetCalculationConcepts: true,
      travelExpenseCalculationConcepts:
        get().travelExpenseCalculationConcepts,
    });

    return get().travelExpenseCalculationConcepts;
  }

  set({
    loadingCalculationConcepts: true,
    error: undefined,
    successGetCalculationConcepts: false,
  });

  try {
    const getRequest = pGet(requireGateway("get"));
    const res: AxiosResponse = await getRequest(
      BillingTravelExpensesCalculationConcepts,
    );
    const raw = res.data?.data ?? res.data;
    const concepts = Array.isArray(raw)
      ? raw.filter((item): item is string => typeof item === "string")
      : [];

    set({
      travelExpenseCalculationConcepts: concepts,
      loadingCalculationConcepts: false,
      successGetCalculationConcepts: true,
    });

    return concepts;
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      loadingCalculationConcepts: false,
      successGetCalculationConcepts: false,
      error: normalized.message,
    });

    return [];
  }
};
