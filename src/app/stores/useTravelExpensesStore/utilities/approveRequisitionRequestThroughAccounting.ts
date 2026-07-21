"use client";

import type { AxiosResponse } from "axios";

import type { Get, Set } from "../types";

import { AuthorizationApproveThroughAccounting } from "@/app/configurations/Axios/urls";
import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Approves a requisition request from the accounting review flow.
 *
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param idRequisitionRequest Requisition request identifier.
 * @returns Whether the approval request succeeded.
 */
export const approveRequisitionRequestThroughAccounting = async (
  set: Set,
  get: Get,
  idRequisitionRequest: string,
): Promise<boolean> => {
  if (!idRequisitionRequest) return false;

  set({ approving: true, error: undefined, successApprove: false });

  try {
    const put = pPut(requireGateway("put"), [200, 201]);
    const params = new URLSearchParams({
      IdRequisitionRequest: idRequisitionRequest,
    });
    const res: AxiosResponse = await put(
      `${AuthorizationApproveThroughAccounting}?${params.toString()}`,
      {},
    );
    const success = Boolean(res);
    const markApproved = (item: TravelExpense | undefined) =>
      item
        ? {
            ...item,
            status: "Aprobada",
            status_name: "Aprobada",
          }
        : item;

    set({
      approving: false,
      successApprove: success,
      currentRequisitionRequest: markApproved(get().currentRequisitionRequest),
      travelExpenses: get().travelExpenses.map((item) =>
        item.id === idRequisitionRequest ||
        item.billingrequisition_id === idRequisitionRequest ||
        item.requisition_requests.some(
          (request) => request.id === idRequisitionRequest,
        )
          ? {
              ...item,
              status: "Aprobada",
              status_name: "Aprobada",
            }
          : item,
      ),
    });

    return success;
  } catch (error) {
    const normalized = normalizeApiError(error);
    set({
      approving: false,
      successApprove: false,
      error: normalized.message,
    });

    return false;
  }
};
