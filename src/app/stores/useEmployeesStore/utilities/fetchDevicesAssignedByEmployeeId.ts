import { EmployeesDevicesAssigned } from "@/app/configurations/Axios/urls";
import { InternalDeviceAssignmentsHistoryMap } from "@/app/mappings/internaldevices/internaldevices.mapper";
import type { InternalDeviceAssignmentHistory } from "@/app/mappings/internaldevices/internaldevices.types";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";

import type { Get, Set } from "../types";

export const fetchDevicesAssignedByEmployeeId = async (
  employeeId: string,
  set: Set,
  get: Get,
  force = false
): Promise<InternalDeviceAssignmentHistory[] | null> => {
  if (
    !force &&
    get().lastDevicesAssignedEmployeeId === employeeId &&
    get().devicesAssignedHistory.length > 0
  ) {
    set({
      successGetDevicesAssignedHistory: true,
      error: undefined,
    });
    return get().devicesAssignedHistory;
  }

  set({
    loadingDevicesAssignedHistory: true,
    error: undefined,
    successGetDevicesAssignedHistory: false,
  });

  try {
    const getFn = requireGateway("get");
    const res = await pGet(getFn)(`${EmployeesDevicesAssigned}/${employeeId}`);
    const raw = res.data?.data ?? res.data ?? [];
    const mapped: InternalDeviceAssignmentHistory[] =
      InternalDeviceAssignmentsHistoryMap(Array.isArray(raw) ? raw : []);

    set({
      devicesAssignedHistory: mapped,
      lastDevicesAssignedEmployeeId: employeeId,
      loadingDevicesAssignedHistory: false,
      successGetDevicesAssignedHistory: true,
    });

    return mapped;
  } catch (err) {
    const e = normalizeApiError(err);
    set({
      loadingDevicesAssignedHistory: false,
      successGetDevicesAssignedHistory: false,
      error: e.message,
    });
    return null;
  }
};
