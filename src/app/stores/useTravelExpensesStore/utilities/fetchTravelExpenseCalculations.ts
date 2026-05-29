"use client";

import type { AxiosResponse } from "axios";

import type { Get, Set } from "../types";

import { BillingTravelExpensesCalculations } from "@/app/configurations/Axios/urls";
import type { TravelExpenseCalculation } from "@/app/mappings/travelExpenseCalculations/travelExpenseCalculations.types";
import { TravelExpenseCalculationsMap } from "@/app/mappings/travelExpenseCalculations/travelExpenseCalculations.mapper";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Fetches travel expense calculation rows by requisition request id.
 *
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param idRequisitionRequest Requisition request identifier.
 * @returns Normalized travel expense calculation rows.
 */
export const fetchTravelExpenseCalculations = async (
  set: Set,
  get: Get,
  idRequisitionRequest: string,
): Promise<TravelExpenseCalculation[]> => {
  set({ loadingCalculations: true, error: undefined });

  try {
    const getRequest = pGet(requireGateway("get"));
    const res: AxiosResponse = await getRequest(
      `${BillingTravelExpensesCalculations}/${idRequisitionRequest}`,
    );
    const raw = res.data?.data ?? res.data;
    const rows = TravelExpenseCalculationsMap(Array.isArray(raw) ? raw : []);

    set({
      loadingCalculations: false,
      travelExpenseCalculationsByRequest: {
        ...get().travelExpenseCalculationsByRequest,
        [idRequisitionRequest]: rows,
      },
    });

    return rows;
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      loadingCalculations: false,
      error: normalized.message,
    });

    return [];
  }
};

