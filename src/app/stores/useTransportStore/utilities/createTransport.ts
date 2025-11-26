'use client'

import type { AxiosResponse } from "axios";

import type { GetState, SetState } from "../types";

import { fetchTransports } from "./fetchTransports";

import { Transport as TransportUrl } from "@/app/configurations/Axios/urls";
import { transportTransformer } from "@/app/mappings/transport/transformers";
import type { CompleteTransport, TransportPost } from "@/app/mappings/transport/transport.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPost } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const createTransport = async (
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
    const res: AxiosResponse = await post(TransportUrl, body);
    const raw = res.data?.data ?? res.data ?? null;
    const created = raw ? transportTransformer.mapTransport(raw) : null;

    await fetchTransports(set, get, true);

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

