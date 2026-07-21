"use client";

import type { AxiosResponse } from "axios";

import type { Get, Set, TravelExpenseCalculationPayload } from "../types";

import { fetchTravelExpenseCalculations } from "./fetchTravelExpenseCalculations";

import { BillingTravelExpensesCalculations } from "@/app/configurations/Axios/urls";
import type { TravelExpenseCalculation } from "@/app/mappings/travelExpenseCalculations/travelExpenseCalculations.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPost, pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Creates or updates travel expense calculation rows and refreshes them from backend.
 *
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param rows Calculation rows to persist.
 * @returns Refreshed calculation rows from backend.
 */
export const saveTravelExpenseCalculations = async (
  set: Set,
  get: Get,
  rows: TravelExpenseCalculationPayload[],
): Promise<TravelExpenseCalculation[]> => {
  const idRequisitionRequest = rows[0]?.id_requisition_request ?? "";

  if (!idRequisitionRequest) {
    set({
      error: "No se encontro el identificador de la requisicion solicitada.",
      successSaveCalculations: false,
    });
    return [];
  }

  set({
    savingCalculations: true,
    error: undefined,
    successSaveCalculations: false,
  });

  try {
    const post = pPost(requireGateway("post"), [200, 204]);
    const put = pPut(requireGateway("put"), [200, 204]);

    await Promise.all(
      rows.map((row): Promise<AxiosResponse> => {
        if (row.id) {
          return put(BillingTravelExpensesCalculations, row);
        }

        return post(BillingTravelExpensesCalculations, row);
      }),
    );

    const refreshedRows = await fetchTravelExpenseCalculations(
      set,
      get,
      idRequisitionRequest,
    );

    set({
      savingCalculations: false,
      successSaveCalculations: true,
    });

    return refreshedRows;
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      savingCalculations: false,
      successSaveCalculations: false,
      error: normalized.message,
    });

    return [];
  }
};
