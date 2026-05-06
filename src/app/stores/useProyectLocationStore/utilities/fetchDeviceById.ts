import type { AxiosResponse } from 'axios';

import type { GetProyectLocation, SetProyectLocation } from '../types';

import { ReportDeviceExternalById } from '@/app/configurations/Axios/urls';
import { mapReportDevicesExternal } from '@/app/mappings/reports/report.mapper';
import type { ReportDeviceView } from '@/app/mappings/reports/reports.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pGet } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const fetchDeviceById = async (
  deviceId: string,
  set: SetProyectLocation,
  get: GetProyectLocation,
  force = false,
): Promise<ReportDeviceView | null> => {
  const trimmed = deviceId?.trim();
  if (!trimmed) {
    set({ currentDevice: null, lastCurrentDeviceId: null });
    return null;
  }

  const { currentDevice, lastCurrentDeviceId } = get();
  if (!force && currentDevice && lastCurrentDeviceId === trimmed) return currentDevice;

  set({ loadingCurrentDevice: true, error: undefined });

  try {
    const getFn = requireGateway('get');
    const url = `${ReportDeviceExternalById}/${encodeURIComponent(trimmed)}`;
    const response: AxiosResponse = await pGet(getFn)(url);
    const raw = response.data?.data ?? null;
    const mapped = raw ? mapReportDevicesExternal([raw])[0] ?? null : null;

    set({
      currentDevice: mapped,
      lastCurrentDeviceId: trimmed,
      loadingCurrentDevice: false,
    });

    return mapped;
  } catch (error) {
    set({
      loadingCurrentDevice: false,
      error: normalizeApiError(error).message,
    });
    return null;
  }
};
