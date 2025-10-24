'use client'

import type { AxiosResponse } from "axios";

import type { GetState, SetState } from "../types";

import { fetchAssignments } from "./fetchAssignments";

import {
  TransportAssigments as TransportAssignmentsUrl,
} from "@/app/configurations/Axios/urls";
import { transportTransformer } from "@/app/mappings/transport/transformers";
import type {
  TransportAssignament,
  TransportAssignamentPut,
} from "@/app/mappings/transport/transport.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const updateAssignment = async (
  set: SetState,
  get: GetState,
  payload: TransportAssignamentPut
): Promise<TransportAssignament | null> => {
  set({
    updatingAssignment: true,
    error: undefined,
    warning: undefined,
    successUpdateAssignment: false,
  });

  try {
    const put = pPut(requireGateway("put"), [200, 204]);
    const res: AxiosResponse = await put(
      TransportAssignmentsUrl,
      transportTransformer.mapTransportAssignamentPut(payload)
    );
    const raw = res.data?.data ?? res.data ?? null;
    const updated = raw
      ? transportTransformer.mapTransportAssignament(raw)
      : null;

    await fetchAssignments(set, get, true);

    if (updated) {
      set({ currentAssignment: updated });
    }

    set({
      updatingAssignment: false,
      successUpdateAssignment: true,
    });

    return updated;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      updatingAssignment: false,
      successUpdateAssignment: false,
      error: err.message,
    });
    return null;
  }
};

