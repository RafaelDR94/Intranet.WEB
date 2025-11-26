'use client'

import type { AxiosResponse } from "axios";

import type { GetState, SetState } from "../types";

import {
  Transport as TransportUrl,
} from "@/app/configurations/Axios/urls";
import { transportTransformer } from "@/app/mappings/transport/transformers";
import type { CompleteTransport } from "@/app/mappings/transport/transport.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchTransports = async (
  set: SetState,
  get: GetState,
  force = false
): Promise<CompleteTransport[] | null> => {
  if (!force && get().transports.length > 0) {
    return get().transports;
  }

  set({
    loadingTransports: true,
    error: undefined,
    warning: undefined,
    successGetTransports: false,
  });

  try {
    const getFn = pGet(requireGateway("get"),[200,201]);
    const res: AxiosResponse = await getFn(TransportUrl);
    const raw = res.data?.data ?? res.data ?? [];
    const list = transportTransformer.mapTransportList(
      Array.isArray(raw) ? raw : raw?.items ?? []
    );

    set({
      transports: list,
      loadingTransports: false,
      successGetTransports: true,
    });

    return list;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      loadingTransports: false,
      successGetTransports: false,
      error: err.message,    });
    return null;
  }
};

