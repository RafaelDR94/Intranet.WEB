'use client'

import type { AxiosResponse } from "axios";

import type { GetState, SetState } from "../types";

import { fetchVehicleTrackings } from "./fetchVehicleTrackings";

import {
  TransportVehicleTracking as VehicleTrackingUrl,
} from "@/app/configurations/Axios/urls";
import { transportTransformer } from "@/app/mappings/transport/transformers";
import type {
  VehicleTraking,
  VehicleTrakingPost,
} from "@/app/mappings/transport/transport.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPost } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const createVehicleTracking = async (
  set: SetState,
  get: GetState,
  payload: VehicleTrakingPost
): Promise<VehicleTraking | null> => {
  set({
    creatingVehicleTracking: true,
    error: undefined,
    warning: undefined,
    successCreateVehicleTracking: false,
  });

  try {
    const post = pPost(requireGateway("post"), [200, 201]);
    const res: AxiosResponse = await post(
      VehicleTrackingUrl,
      payload
    );
    const raw = res.data?.data ?? res.data ?? null;
    const created = raw ? transportTransformer.mapVehicleTraking(raw) : null;

    await fetchVehicleTrackings(set, get, true);

    set({
      creatingVehicleTracking: false,
      successCreateVehicleTracking: true,
    });

    return created;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      creatingVehicleTracking: false,
      successCreateVehicleTracking: false,
      error: err.message,

    });
    return null;
  }
};

