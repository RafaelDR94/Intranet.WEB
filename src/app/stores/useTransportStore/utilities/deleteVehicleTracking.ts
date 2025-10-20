'use client'

import type { AxiosResponse } from "axios";

import type { GetState, SetState } from "../types";

import {
  TransportVehicleTracking as VehicleTrackingUrl,
} from "@/app/configurations/Axios/urls";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pDelete } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

export const deleteVehicleTracking = async (
  set: SetState,
  get: GetState,
  id: string
): Promise<boolean> => {
  set({
    deletingVehicleTracking: true,
    error: undefined,
    warning: undefined,
    successDeleteVehicleTracking: false,
  });

  try {
    const del = pDelete(requireGateway("del"), [200, 204]);
    const _res: AxiosResponse = await del(`${VehicleTrackingUrl}/${id}`);

    set((state) => ({
      vehicleTrackings: state.vehicleTrackings.filter(
        (tracking) => tracking.id !== id
      ),
      vehicleTracking:
        state.vehicleTracking?.id === id ? undefined : state.vehicleTracking,
      deletingVehicleTracking: false,
      successDeleteVehicleTracking: true,
    }));

    return true;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      deletingVehicleTracking: false,
      successDeleteVehicleTracking: false,
      error: err.message,
    });
    return false;
  }
};

