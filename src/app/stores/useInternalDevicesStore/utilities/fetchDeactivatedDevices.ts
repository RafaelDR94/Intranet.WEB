"use client";

import type { AxiosResponse } from "axios";

import type { Get, Set } from "../types";

import { AllDevices } from "@/app/configurations/Axios/urls";
import { InternalDevicesMap } from "@/app/mappings/internaldevices/internaldevices.mapper";
import type { InternalDevice } from "@/app/mappings/internaldevices/internaldevices.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Fetch inactive internal devices from the inventory endpoint.
 */
export const fetchDeactivatedDevices = async (
  set: Set,
  get: Get,
  force = false,
): Promise<InternalDevice[] | null> => {
  if (!force && get().deactivatedDevices.length > 0) {
    return get().deactivatedDevices;
  }

  set({
    loadingDeactivatedDevices: true,
    error: undefined,
    successGetDeactivatedDevices: false,
  });

  try {
    const getFn = requireGateway("get");
    const res: AxiosResponse = await pGet(getFn)(
      `${AllDevices}?isActive=false`,
    );
    const payload = res.data?.data ?? res.data ?? [];
    const list = InternalDevicesMap(Array.isArray(payload) ? payload : []);

    set({
      deactivatedDevices: list,
      loadingDeactivatedDevices: false,
      successGetDeactivatedDevices: true,
    });

    return list;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      loadingDeactivatedDevices: false,
      successGetDeactivatedDevices: false,
      error: err.message,
    });
    return null;
  }
};
