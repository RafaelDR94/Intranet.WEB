'use client'

import type { AxiosResponse } from "axios";

import type { SetState, GetState } from "../types";

import { Transport as TransportUrl } from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pDelete } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const deleteTransport = async (
  set: SetState,
  get: GetState,
  id: string
): Promise<boolean> => {
  set({
    deletingTransport: true,
    error: undefined,
    warning: undefined,
    successDeleteTransport: false,
  });

  try {
    const del = pDelete(requireGateway("del"), [200, 204]);
    const _res: AxiosResponse = await del(`${TransportUrl}/${id}`);

    set((state) => ({
      transports: state.transports.filter(
        (transport) => transport.transport_id !== id
      ),
      deletingTransport: false,
      successDeleteTransport: true,
      transport:
        state.transport?.transport_id === id ? undefined : state.transport,
    }));

    return true;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      deletingTransport: false,
      successDeleteTransport: false,
      error: err.message,
    });
    return false;
  }
};

