"use client";

import type { Get, Set } from "../types";

import { Assigment } from "@/app/configurations/Axios/urls";
import type { InternalDeviceAssignmentDelete } from "@/app/mappings/internaldevices/internaldevices.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pDelete } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import { fetchDeviceAssignments } from "./fetchDeviceAssignments";
import { fetchInternalDevices } from "./fetchInternalDevices";

/**
 * Delete device assignment.
 */
export const deleteDeviceAssignment = async (
  set: Set,
  get: Get,
  payload: InternalDeviceAssignmentDelete,
): Promise<boolean> => {
  set({
    deletingDeviceAssignment: true,
    error: undefined,
    successDeleteDeviceAssignment: false,
  });

  try {
    const del = pDelete(requireGateway("del"), [200, 204]);
    await del(Assigment, payload);

    // Both assignment and inventory views consume this store. Refresh them
    // together so an unassigned device immediately changes status everywhere.
    await Promise.all([
      fetchDeviceAssignments(set, get, true),
      fetchInternalDevices(set, get, true),
    ]);

    if (
      get().deviceAssignment?.device_assigment_id ===
      payload.device_assignment_id
    ) {
      set({ deviceAssignment: undefined });
    }

    set({
      deletingDeviceAssignment: false,
      successDeleteDeviceAssignment: true,
    });
    return true;
  } catch (error) {
    const err = normalizeApiError(error);
    set({
      deletingDeviceAssignment: false,
      successDeleteDeviceAssignment: false,
      error: err.message,
    });
    return false;
  }
};
