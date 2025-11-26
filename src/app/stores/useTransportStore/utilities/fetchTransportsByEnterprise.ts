'use client'

import type { AxiosResponse } from "axios";

import { transportTransformer } from "@/app/mappings/transport/transformers";
import type { CompleteTransport } from "@/app/mappings/transport/transport.types";
import { TransportByEnterprise as TransportByEnterpriseUrl } from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import type { GetState, SetState } from "../types";

export const fetchTransportsByEnterprise = async (
  idEnterprise: string,
  set: SetState,
  get: GetState,
  force = false
): Promise<CompleteTransport[] | null> => {
  if (!force && get().loadingTransports) return null;

  set({
    loadingTransports: true,
    error: undefined,
    warning: undefined,
    successGetTransports: false,
  });

  try {
    const getRequest = pGet(requireGateway("get"), [200, 201]);
    const res: AxiosResponse = await getRequest(
      `${TransportByEnterpriseUrl}/${idEnterprise}`
    );
    const raw = res.data?.data ?? res.data ?? [];
    const transports = transportTransformer.mapCompleteTransportList(raw);
    set({
      transports,
      loadingTransports: false,
      successGetTransports: true,
    });

    return transports;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      loadingTransports: false,
      successGetTransports: false,
      error: err.message,
    });
    return null;
  }
};

