"use client";

import { BillingRequisitionRequestImages } from "@/app/configurations/Axios/urls";
import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import type { Get, Set, UpdateRequisitionRequestImagesPayload } from "../types";

const patchImages = (
  row: TravelExpense,
  id: string,
  imageUrls: string[],
): TravelExpense => ({
  ...row,
  image_urls: imageUrls,
  requisition_requests: row.requisition_requests.map((request) =>
    request.id === id ? { ...request, image_urls: imageUrls } : request,
  ),
});

export const updateRequisitionRequestImages = async (
  set: Set,
  get: Get,
  payload: UpdateRequisitionRequestImagesPayload,
): Promise<boolean> => {
  set({ updatingRequisitionRequestImages: true, error: undefined });
  try {
    await pPut(requireGateway("put"), [200, 201])(
      BillingRequisitionRequestImages,
      payload,
    );
    set({
      updatingRequisitionRequestImages: false,
      currentRequisitionRequest: get().currentRequisitionRequest
        ? patchImages(
            get().currentRequisitionRequest!,
            payload.idRequisitionRequest,
            payload.imageUrls,
          )
        : undefined,
      treasuryRequisitionRequests: get().treasuryRequisitionRequests.map(
        (row) =>
          row.id === payload.idRequisitionRequest
            ? patchImages(row, payload.idRequisitionRequest, payload.imageUrls)
            : row,
      ),
    });
    return true;
  } catch (error) {
    set({
      updatingRequisitionRequestImages: false,
      error: normalizeApiError(error).message,
    });
    return false;
  }
};
