'use client'

import type { AxiosResponse } from "axios";

import type { GetState, SetState } from "../types";

import {
  TransportAssigmentInfo as TransportAssignmentInfoUrl,
} from "@/app/configurations/Axios/urls";
import { transportTransformer } from "@/app/mappings/transport/transformers";
import type { TransportAssignament } from "@/app/mappings/transport/transport.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchAssignmentById = async (
  id: string,
  set: SetState,
  get: GetState,
  force = false
): Promise<TransportAssignament | null> => {
  const cached = get().currentAssignment;
  if (!force && cached && cached.vehicleassignments_id === id) {
    return cached;
  }

  set({
    loadingAssignments: true,
    error: undefined,
    warning: undefined,
    successGetAssignment: false,
  });

  try {
    const getFn = pGet(requireGateway("get"));
    const res: AxiosResponse = await getFn(
      `${TransportAssignmentInfoUrl}/${id}`
    );
    const raw = res.data?.data ?? res.data ?? null;
    const mapped = raw
      ? transportTransformer.mapTransportAssignament(raw)
      : null;

    set({
      currentAssignment: mapped ?? undefined,
      loadingAssignments: false,
      successGetAssignment: Boolean(mapped),
    });

    return mapped;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      loadingAssignments: false,
      successGetAssignment: false,
      error: err.message,
    });
    return null;
  }
};

