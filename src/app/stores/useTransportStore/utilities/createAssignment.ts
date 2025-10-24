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
  TransportAssignamentPost,
} from "@/app/mappings/transport/transport.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPost } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const createAssignment = async (
  set: SetState,
  get: GetState,
  payload: TransportAssignamentPost
): Promise<TransportAssignament | null> => {
  set({
    creatingAssignment: true,
    error: undefined,
    warning: undefined,
    successCreateAssignment: false,
  });

  try {
    const post = pPost(requireGateway("post"), [200, 201]);
    const res: AxiosResponse = await post(
      TransportAssignmentsUrl,
      transportTransformer.mapTransportAssignamentPost(payload)
    );
    const raw = res.data?.data ?? res.data ?? null;
    const created = raw
      ? transportTransformer.mapTransportAssignament(raw)
      : null;

    await fetchAssignments(set, get, true);

    set({
      creatingAssignment: false,
      successCreateAssignment: true,
    });

    return created;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      creatingAssignment: false,
      successCreateAssignment: false,
      error: err.message,
    });
    return null;
  }
};

