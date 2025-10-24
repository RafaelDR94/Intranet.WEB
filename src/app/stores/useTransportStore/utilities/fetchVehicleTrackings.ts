'use client'

import type { AxiosResponse } from "axios";

import type { GetState, SetState } from "../types";

import {
  TransportVehicleTracking as VehicleTrackingUrl,
} from "@/app/configurations/Axios/urls";
import { transportTransformer } from "@/app/mappings/transport/transformers";
import type { VehicleTraking } from "@/app/mappings/transport/transport.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchVehicleTrackings = async (
  set: SetState,
  get: GetState,
  force = false
): Promise<VehicleTraking[] | null> => {
  if (!force && get().vehicleTrackings.length > 0) {
    return get().vehicleTrackings;
  }

  set({
    loadingVehicleTracking: true,
    error: undefined,
    warning: undefined,
    successGetVehicleTrackings: false,
  });

  try {
    const getFn = pGet(requireGateway("get"));
    const res: AxiosResponse = await getFn(VehicleTrackingUrl);
    const raw = res.data?.data ?? res.data ?? [];
    const list = transportTransformer.mapVehicleTrakingList(
      Array.isArray(raw) ? raw : raw?.items ?? []
    );

    set({
      vehicleTrackings: list,
      loadingVehicleTracking: false,
      successGetVehicleTrackings: true,
    });

    return list;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      loadingVehicleTracking: false,
      successGetVehicleTrackings: false,
      error: err.message,

    });
    return null;
  }
};

