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
  VehicleTrakingPut,
} from "@/app/mappings/transport/transport.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const updateVehicleTracking = async (
  set: SetState,
  get: GetState,
  payload: VehicleTrakingPut
): Promise<VehicleTraking | null> => {
  set({
    updatingVehicleTracking: true,
    error: undefined,
    warning: undefined,
    successUpdateVehicleTracking: false,
  });

  try {
    const put = pPut(requireGateway("put"), [200, 204]);
    const res: AxiosResponse = await put(
      VehicleTrackingUrl,
      transportTransformer.mapVehicleTrakingPut(payload)
    );
    const raw = res.data?.data ?? res.data ?? null;
    const updated = raw ? transportTransformer.mapVehicleTraking(raw) : null;

    await fetchVehicleTrackings(set, get, true);

    set({
      updatingVehicleTracking: false,
      successUpdateVehicleTracking: true,
    });

    return updated;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      updatingVehicleTracking: false,
      successUpdateVehicleTracking: false,
      error: err.message,
    });
    return null;
  }
};

