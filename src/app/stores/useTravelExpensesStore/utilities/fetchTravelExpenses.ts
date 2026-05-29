"use client";

import type { AxiosResponse } from "axios";

import type { Get, Set } from "../types";

import { BillingTravelExpenses } from "@/app/configurations/Axios/urls";
import { TravelExpensesMap } from "@/app/mappings/travelExpenses/travelExpenses.mapper";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Fetches active travel expense requisitions.
 *
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param force Forces a new request even when data is already loaded.
 */
export const fetchTravelExpenses = async (
  set: Set,
  get: Get,
  force = false
) => {
  if (get().travelExpenses.length > 0 && !force) return;

  set({ loading: true, error: undefined, successGet: false });

  try {
    const getReq = pGet(requireGateway("get"));
    const params = new URLSearchParams({ active: "true" });
    const res: AxiosResponse = await getReq(
      `${BillingTravelExpenses}?${params.toString()}`
    );
    const mapped = TravelExpensesMap(res.data?.data ?? []);

    set({ travelExpenses: mapped, loading: false, successGet: true });
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      error: normalized.message,
      loading: false,
      successGet: false,
      travelExpenses: [],
    });
  }
};
