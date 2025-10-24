'use client'

import type { AxiosResponse } from "axios";

import type { GetState, SetState } from "../types";

import {
  TransportVehicleTrackingById as VehicleTrackingByIdUrl,
} from "@/app/configurations/Axios/urls";
import { transportTransformer } from "@/app/mappings/transport/transformers";
import type { VehicleTraking } from "@/app/mappings/transport/transport.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const fetchVehicleTrackingById = async (
  id: string,
  set: SetState,
  get: GetState,
  force = false
): Promise<VehicleTraking | null> => {
  const cached = get().vehicleTracking;
  if (!force && cached && cached.id === id) {
    return cached;
  }

  set({
    loadingVehicleTracking: true,
    error: undefined,
    warning: undefined,
    successGetVehicleTracking: false,
  });

  try {
    const getFn = pGet(requireGateway("get"));
    const res: AxiosResponse = await getFn(
      `${VehicleTrackingByIdUrl}/${id}`
    );
    const raw = res.data?.data ?? res.data ?? null;
    const mapped = raw ? transportTransformer.mapVehicleTraking(raw) : null;

    set((state) => ({
      vehicleTracking: mapped ?? undefined,
      vehicleTrackings: mapped
        ? state.vehicleTrackings.some((item) => item.id === mapped.id)
          ? state.vehicleTrackings.map((item) =>
              item.id === mapped.id ? mapped : item
            )
          : state.vehicleTrackings
        : state.vehicleTrackings,
      loadingVehicleTracking: false,
      successGetVehicleTracking: Boolean(mapped),
    }));

    return mapped;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      loadingVehicleTracking: false,
      successGetVehicleTracking: false,
      error: err.message,
    });
    return null;
  }
};

