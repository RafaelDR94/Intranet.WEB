'use client'

import type { AxiosResponse } from "axios";

import type { GetState, SetState } from "../types";

import {
  TransportAssigment as TransportAssignmentUrl,
} from "@/app/configurations/Axios/urls";
import { transportTransformer } from "@/app/mappings/transport/transformers";
import type { TransportAssignament } from "@/app/mappings/transport/transport.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchAssignments = async (
  set: SetState,
  get: GetState,
  force = false
): Promise<TransportAssignament[] | null> => {
  if (!force && get().assignments.length > 0) {
    return get().assignments;
  }

  set({
    loadingAssignments: true,
    error: undefined,
    warning: undefined,
    successGetAssignments: false,
  });

  try {
    const getFn = pGet(requireGateway("get"));
    const res: AxiosResponse = await getFn(TransportAssignmentUrl);
    const raw = res.data?.data ?? res.data ?? [];
    const list = transportTransformer.mapTransportAssignaments(
      Array.isArray(raw) ? raw : raw?.items ?? []
    );

    set({
      assignments: list,
      loadingAssignments: false,
      successGetAssignments: true,
    });

    return list;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      loadingAssignments: false,
      successGetAssignments: false,
      error: err.message,

    });
    return null;
  }
};

