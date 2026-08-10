"use client";

import type { AxiosResponse } from "axios";

import type { Set } from "../types";

import { BillingRequisitionRequest } from "@/app/configurations/Axios/urls";
import { TravelExpensesMap } from "@/app/mappings/travelExpenses/travelExpenses.mapper";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/** Fetches the unfiltered requisition-request summary used by Operations. */
export const fetchOperationsRequisitionRequests = async (
  set: Set,
) => {
  set({
    loadingOperationsRequisitionRequests: true,
    operationsRequisitionRequestsError: undefined,
    operationsRequisitionRequests: [],
  });

  try {
    const getReq = pGet(requireGateway("get"));
    const response: AxiosResponse = await getReq(BillingRequisitionRequest);
    const payload = response.data?.data ?? response.data;
    const rows = Array.isArray(payload) ? payload : [];

    set({
      operationsRequisitionRequests: TravelExpensesMap(rows),
      loadingOperationsRequisitionRequests: false,
    });
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      loadingOperationsRequisitionRequests: false,
      operationsRequisitionRequestsError: normalized.message,
      operationsRequisitionRequests: [],
    });
  }
};
