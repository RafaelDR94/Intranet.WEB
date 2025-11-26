'use client'

import type { AxiosResponse } from "axios";

import type { GetState, SetState } from "../types";

import { fetchTransports } from "./fetchTransports";
import { fetchTransportsByEnterprise } from "./fetchTransportsByEnterprise";
import { Transport as TransportUrl } from "@/app/configurations/Axios/urls";
import { transportTransformer } from "@/app/mappings/transport/transformers";
import type { CompleteTransport, TransportPut } from "@/app/mappings/transport/transport.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const updateTransport = async (
  set: SetState,
  get: GetState,
  payload: TransportPut
): Promise<CompleteTransport | null> => {
  set({
    updatingTransport: true,
    error: undefined,
    warning: undefined,
    successUpdateTransport: false,
  });

  try {
    const put = pPut(requireGateway("put"), [200, 204]);
    const res: AxiosResponse = await put(
      TransportUrl,
      transportTransformer.mapTransportPut(payload)
    );
    const raw = res.data?.data ?? res.data ?? null;
    const updated = raw ? transportTransformer.mapTransport(raw) : null;
    if (payload.id_external_enterprise) {
      await fetchTransportsByEnterprise(payload.id_external_enterprise,set, get,true)
    } else {
      await fetchTransports(set, get, true);
    }
    set({
      updatingTransport: false,
      successUpdateTransport: true,
    });

    return updated;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      updatingTransport: false,
      successUpdateTransport: false,
      error: err.message,

    });
    return null;
  }
};

