'use client'

import type { AxiosResponse } from "axios";

import type { GetState, SetState } from "../types";

import { TransportById } from "@/app/configurations/Axios/urls";
import { transportTransformer } from "@/app/mappings/transport/transformers";
import type { CompleteTransport } from "@/app/mappings/transport/transport.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchTransportById = async (
  id: string,
  set: SetState,
  get: GetState,
  force = false
): Promise<CompleteTransport | null> => {
  const cached = get().transport;
  if (!force && cached && cached.transport_id === id) {
    return cached;
  }

  set({
    loadingTransports: true,
    error: undefined,
    warning: undefined,
    successGetTransport: false,
  });

  try {
    const getFn = pGet(requireGateway("get"));
    const res: AxiosResponse = await getFn(`${TransportById}/${id}`);
    const raw = res.data?.data ?? res.data ?? null;
    const mapped = raw ? transportTransformer.mapCompleteTransport(raw) : null;

    set({
      transport: mapped ?? undefined,
      loadingTransports: false,
      successGetTransport: Boolean(mapped),
    });

    return mapped;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      loadingTransports: false,
      successGetTransport: false,
      error: err.message,
    });
    return null;
  }
};

