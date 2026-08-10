"use client";

import type { AxiosResponse } from "axios";

import type { Get, Set } from "../types";

import { BillingTravelExpensesByEmployee } from "@/app/configurations/Axios/urls";
import { TravelExpensesMap } from "@/app/mappings/travelExpenses/travelExpenses.mapper";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/** Fetches active travel expense requisitions for a single employee. */
export const fetchTravelExpensesByEmployee = async (
  set: Set,
  get: Get,
  idEmployee: string,
  force = false,
) => {
  if (get().travelExpenses.length > 0 && !force) return;

  set({
    loading: true,
    error: undefined,
    successGet: false,
    travelExpenses: [],
  });

  try {
    const getReq = pGet(requireGateway("get"));
    const params = new URLSearchParams({ active: "true" });
    const res: AxiosResponse = await getReq(
      `${BillingTravelExpensesByEmployee}/${encodeURIComponent(idEmployee)}?${params.toString()}`,
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
