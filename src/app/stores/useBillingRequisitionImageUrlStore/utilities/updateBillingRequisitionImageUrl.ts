"use client";
import type { AxiosResponse } from "axios";

import type { Get, Set } from "../types";

import { BillingRequisitionImageUrl } from "@/app/configurations/Axios/urls";
import {
  BillingRequisitionImageUrlMap,
  BillingRequisitionImageUrlPutMap,
} from "@/app/mappings/billingRequisitionImageUrl/billingRequisitionImageUrl.map";
import type {
  BillingRequisitionImageUrl as BillingRequisitionImageUrlType,
  BillingRequisitionImageUrlPut,
} from "@/app/mappings/billingRequisitionImageUrl/billingRequisitionImageUrl.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Actualiza la evidencia de aprobaciÃ³n de una requisiciÃ³n.
 *
 * @param set Setter de Zustand.
 * @param get Getter de Zustand.
 * @param payload Datos de evidencia a guardar.
 */
export const updateBillingRequisitionImageUrl = async (
  set: Set,
  get: Get,
  payload: BillingRequisitionImageUrlPut,
): Promise<BillingRequisitionImageUrlType | null> => {
  set({ updating: true, successPut: false, error: undefined });

  try {
    const put = pPut(requireGateway("put"), [200, 201]);
    const normalized = BillingRequisitionImageUrlPutMap(payload);
    const query = new URLSearchParams({
      idRequisition: normalized.idRequisition,
      imageUrl: normalized.imageUrl,
    }).toString();
    const res: AxiosResponse = await put(
      `${BillingRequisitionImageUrl}?${query}`,
      normalized,
    );
    const raw = res.data?.data ?? res.data;
    const mapped = raw ? BillingRequisitionImageUrlMap(raw) : normalized;

    set({
      requisitionImage: mapped,
      updating: false,
      successPut: true,
    });
    return mapped;
  } catch (e) {
    set({
      updating: false,
      successPut: false,
      error: normalizeApiError(e).message,
    });
    return null;
  }
};
