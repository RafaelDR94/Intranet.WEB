"use client";

import type {
  Get,
  RejectRequisitionRequestThroughAccountingPayload,
  Set,
} from "../types";

import { BillingRequisitionRequestAccountingReject } from "@/app/configurations/Axios/urls";
import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Rejects a requisition request from the accounting review flow.
 *
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param payload Requisition request rejection data.
 * @returns Whether the rejection request succeeded.
 */
export const rejectRequisitionRequestThroughAccounting = async (
  set: Set,
  get: Get,
  payload: RejectRequisitionRequestThroughAccountingPayload,
): Promise<boolean> => {
  if (!payload.idRequisitionRequest) return false;

  set({ rejecting: true, error: undefined, successReject: false });

  try {
    const put = pPut(requireGateway("put"), [200, 201]);
    const params = new URLSearchParams({ comment: payload.comment });
    const rejectionUrl = `${BillingRequisitionRequestAccountingReject}/${encodeURIComponent(
      payload.idRequisitionRequest,
    )}?${params.toString()}`;

    await put(rejectionUrl, {});

    const markRejected = (item: TravelExpense): TravelExpense => ({
      ...item,
      status: "TESORERIA",
      status_name: "TESORERIA",
      treasury_status_name: "PENDIENTE",
      accounting_status_name: "RECHAZADA",
      requisition_requests: item.requisition_requests.map((request) =>
        request.id === payload.idRequisitionRequest
          ? {
              ...request,
              status_name: "TESORERIA",
              treasury_status_name: "PENDIENTE",
              accounting_status_name: "RECHAZADA",
            }
          : request,
      ),
    });

    const currentRequisitionRequest = get().currentRequisitionRequest;

    set({
      rejecting: false,
      successReject: true,
      currentRequisitionRequest: currentRequisitionRequest
        ? markRejected(currentRequisitionRequest)
        : undefined,
      travelExpenses: get().travelExpenses.map((item) =>
        item.id === payload.idRequisitionRequest ||
        item.billingrequisition_id === payload.idRequisitionRequest ||
        item.requisition_requests.some(
          (request) => request.id === payload.idRequisitionRequest,
        )
          ? markRejected(item)
          : item,
      ),
      operationsRequisitionRequests:
        get().operationsRequisitionRequests?.map((item) =>
          item.id === payload.idRequisitionRequest ||
          item.billingrequisition_id === payload.idRequisitionRequest ||
          item.requisition_requests.some(
            (request) => request.id === payload.idRequisitionRequest,
          )
            ? markRejected(item)
            : item,
        ) ?? [],
    });

    return true;
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      rejecting: false,
      successReject: false,
      error: normalized.message,
    });

    return false;
  }
};
