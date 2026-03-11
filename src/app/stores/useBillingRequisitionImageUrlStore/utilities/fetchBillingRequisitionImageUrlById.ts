"use client";
import type { AxiosResponse } from "axios";

import type { Get, Set } from "../types";

import { BillingRequisitionImageUrl } from "@/app/configurations/Axios/urls";
import { BillingRequisitionImageUrlMap } from "@/app/mappings/billingRequisitionImageUrl/billingRequisitionImageUrl.map";
import type { BillingRequisitionImageUrl as BillingRequisitionImageUrlType } from "@/app/mappings/billingRequisitionImageUrl/billingRequisitionImageUrl.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Obtiene la evidencia de aprobación de una requisición por id.
 *
 * @param id Id de requisición.
 * @param set Setter de Zustand.
 * @param get Getter de Zustand.
 * @param force Ignora cache local si `true`.
 */
export const fetchBillingRequisitionImageUrlById = async (
  id: string,
  set: Set,
  get: Get,
  force = false,
): Promise<BillingRequisitionImageUrlType | null> => {
  const cached = get().requisitionImage;
  if (!force && cached?.idRequisition === id) {
    return cached;
  }

  set({ loading: true, successGet: false, error: undefined });

  try {
    const getReq = pGet(requireGateway("get"));
    const res: AxiosResponse = await getReq(`${BillingRequisitionImageUrl}/${id}`);
    const raw = res.data?.data ?? res.data;
    const mapped = raw ? BillingRequisitionImageUrlMap(raw) : null;
    set({
      requisitionImage: mapped ?? undefined,
      loading: false,
      successGet: Boolean(mapped),
    });
    return mapped;
  } catch (e) {
    set({
      loading: false,
      successGet: false,
      error: normalizeApiError(e).message,
    });
    return null;
  }
};
