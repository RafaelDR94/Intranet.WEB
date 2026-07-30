"use client";

import type { AxiosResponse } from "axios";

import type { Get, Set } from "../types";

import { UnassignedDevices } from "@/app/configurations/Axios/urls";
import { InternalDevicesMap } from "@/app/mappings/internaldevices/internaldevices.mapper";
import type { InternalDevice } from "@/app/mappings/internaldevices/internaldevices.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Fetch devices that are currently available for assignment.
 */
export const fetchUnassignedDevices = async (
  set: Set,
  get: Get,
  force = false,
): Promise<InternalDevice[] | null> => {
  if (!force && get().unassignedDevices.length > 0) {
    return get().unassignedDevices;
  }

  set({
    loadingUnassignedDevices: true,
    error: undefined,
    successGetUnassignedDevices: false,
  });

  try {
    const getFn = requireGateway("get");
    const res: AxiosResponse = await pGet(getFn)(UnassignedDevices);
    const payload = res.data?.data ?? res.data ?? [];
    const list = InternalDevicesMap(Array.isArray(payload) ? payload : []);

    set({
      unassignedDevices: list,
      loadingUnassignedDevices: false,
      successGetUnassignedDevices: true,
    });

    return list;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      loadingUnassignedDevices: false,
      successGetUnassignedDevices: false,
      error: err.message,
    });
    return null;
  }
};
