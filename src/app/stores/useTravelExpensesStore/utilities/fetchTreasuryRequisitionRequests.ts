"use client";

import type { AxiosResponse } from "axios";

import type { Set } from "../types";

import { BillingRequisitionRequest } from "@/app/configurations/Axios/urls";
import { TravelExpensesMap } from "@/app/mappings/travelExpenses/travelExpenses.mapper";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/** Fetches the requisition-request summary assigned to Treasury. */
export const fetchTreasuryRequisitionRequests = async (
  set: Set,
) => {
  set({
    loadingTreasuryRequisitionRequests: true,
    treasuryRequisitionRequestsError: undefined,
    treasuryRequisitionRequests: [],
  });

  try {
    const getReq = pGet(requireGateway("get"));
    const params = new URLSearchParams({ department: "TESORERIA" });
    const response: AxiosResponse = await getReq(
      `${BillingRequisitionRequest}?${params.toString()}`,
    );
    const payload = response.data?.data ?? response.data;
    const rows = Array.isArray(payload) ? payload : [];

    set({
      treasuryRequisitionRequests: TravelExpensesMap(rows),
      loadingTreasuryRequisitionRequests: false,
    });
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      loadingTreasuryRequisitionRequests: false,
      treasuryRequisitionRequestsError: normalized.message,
      treasuryRequisitionRequests: [],
    });
  }
};
