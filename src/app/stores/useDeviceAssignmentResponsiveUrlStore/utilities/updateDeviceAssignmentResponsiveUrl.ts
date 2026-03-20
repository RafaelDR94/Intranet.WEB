"use client";
import type { AxiosResponse } from "axios";

import type { Get, Set } from "../types";

import { DeviceAssignmentResponsiveUrl } from "@/app/configurations/Axios/urls";
import {
  DeviceAssignmentResponsiveUrlMap,
  DeviceAssignmentResponsiveUrlPutMap,
} from "@/app/mappings/deviceAssignmentResponsiveUrl/deviceAssignmentResponsiveUrl.map";
import type {
  DeviceAssignmentResponsiveUrl as DeviceAssignmentResponsiveUrlType,
  DeviceAssignmentResponsiveUrlPut,
} from "@/app/mappings/deviceAssignmentResponsiveUrl/deviceAssignmentResponsiveUrl.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pPut } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

/**
 * Actualiza la URL de la responsiva para una asignacion de dispositivo.
 *
 * @param set Setter de Zustand.
 * @param get Getter de Zustand.
 * @param payload Datos de responsiva a guardar.
 */
export const updateDeviceAssignmentResponsiveUrl = async (
  set: Set,
  _get: Get,
  payload: DeviceAssignmentResponsiveUrlPut,
): Promise<DeviceAssignmentResponsiveUrlType | null> => {
  set({ updating: true, successPut: false, error: undefined });

  try {
    const put = pPut(requireGateway("put"), [200, 201]);
    const normalized = DeviceAssignmentResponsiveUrlPutMap(payload);
    const responsiveUrlQuery = normalized.responsiveUrl.startsWith(" ")
      ? normalized.responsiveUrl
      : ` ${normalized.responsiveUrl}`;
    const query = new URLSearchParams({
      idDeviceAssignment: normalized.idDeviceAssignment,
      responsiveUrl: responsiveUrlQuery,
    }).toString();
    const res: AxiosResponse = await put(
      `${DeviceAssignmentResponsiveUrl}?${query}`,
      {
        ...normalized,
        responsiveUrl: responsiveUrlQuery,
      },
    );
    const raw = res.data?.data ?? res.data;
    const mapped = raw ? DeviceAssignmentResponsiveUrlMap(raw) : normalized;

    set({
      assignmentResponsive: mapped,
      updating: false,
      successPut: true,
    });
    return mapped;
  } catch (e) {
    set({
      updating: false,
      successPut: false,
      error: normalizeApiError(e).message,
    });
    return null;
  }
};
