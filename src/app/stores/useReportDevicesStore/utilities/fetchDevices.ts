import type { AxiosResponse } from 'axios';

import type { GetReportDevicesState, SetReportDevicesState } from '../types';

import { ReportsDevices } from '@/app/configurations/Axios/urls';
import { mapDevicesExternal } from '@/app/mappings/reports/report.mapper';
import type { DeviceExternalView } from '@/app/mappings/devices/devices.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pGet } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const fetchDevices = async (
  set: SetReportDevicesState,
  get: GetReportDevicesState,
  force = false,
): Promise<DeviceExternalView[]> => {
  const { devices } = get();
  if (!force && devices.length > 0) return devices;

  set({ loading: true, error: undefined, successGet: false });

  try {
    const getFn = requireGateway('get');
    const response: AxiosResponse = await pGet(getFn)(ReportsDevices);
    const raw = response.data?.data ?? [];
    const mapped = mapDevicesExternal(Array.isArray(raw) ? raw : []);
    set({ devices: mapped, loading: false, successGet: true });
    return mapped;
  } catch (error) {
    set({
      loading: false,
      successGet: false,
      error: normalizeApiError(error).message,
    });
    return [];
  }
};
