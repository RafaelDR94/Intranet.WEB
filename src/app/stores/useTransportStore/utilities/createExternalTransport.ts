'use client'

import type { AxiosResponse } from "axios";

import { TransportExternal as TransportExternalUrl } from "@/app/configurations/Axios/urls";
import { transportTransformer } from "@/app/mappings/transport/transformers";
import type { CompleteTransport, TransportPost } from "@/app/mappings/transport/transport.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPost } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";
import { fetchTransportsByEnterprise } from "./fetchTransportsByEnterprise";
import type { GetState, SetState } from "../types";
import { fetchTransports } from "./fetchTransports";

export const createExternalTransport = async (
  set: SetState,
  get: GetState,
  payload: TransportPost
): Promise<CompleteTransport | null> => {
  set({
    creatingTransport: true,
    error: undefined,
    warning: undefined,
    successCreateTransport: false,
  });

  try {
    const post = pPost(requireGateway("post"), [200, 201]);
    const body = transportTransformer.mapTransportPost(payload);
    const res: AxiosResponse = await post(TransportExternalUrl, body);
    const raw = res.data?.data ?? res.data ?? null;
    const created = raw
      ? transportTransformer.mapCompleteTransport(raw)
      : null;
 if (payload.id_external_enterprise) {
      await fetchTransportsByEnterprise(payload.id_external_enterprise,set, get,true)
    } else {
      await fetchTransports(set, get, true);
    }
    set({
      creatingTransport: false,
      successCreateTransport: true,
    });

    return created;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      creatingTransport: false,
      successCreateTransport: false,
      error: err.message,
    });
    return null;
  }
};

