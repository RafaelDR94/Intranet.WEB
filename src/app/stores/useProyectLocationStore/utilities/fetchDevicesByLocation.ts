import type { AxiosResponse } from 'axios';

import type { GetProyectLocation, SetProyectLocation } from '../types';

import { ReportsDevicesByLocation } from '@/app/configurations/Axios/urls';
import { mapReportDevicesExternal } from '@/app/mappings/reports/report.mapper';
import type { ReportDeviceView } from '@/app/mappings/reports/reports.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pGet } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const fetchDevicesByLocation = async (
  locationId: string,
  set: SetProyectLocation,
  get: GetProyectLocation,
  force = false,
) => {
  const trimmed = locationId?.trim();
  if (!trimmed) {
    set({ devices: [], lastLocationId: null });
    return;
  }

  const { lastLocationId, devices } = get();
  if (!force && lastLocationId === trimmed && devices.length > 0) return;

  set({ loadingDevices: true, error: undefined });

  try {
    const getFn = requireGateway('get');
    const url = `${ReportsDevicesByLocation}/${encodeURIComponent(trimmed)}`;
    const response: AxiosResponse = await pGet(getFn)(url);
    const raw = response.data?.data ?? [];
    const mapped: ReportDeviceView[] = mapReportDevicesExternal(Array.isArray(raw) ? raw : []);

    set({
      devices: mapped,
      lastLocationId: trimmed,
      loadingDevices: false,
    });
  } catch (error) {
    set({
      loadingDevices: false,
      error: normalizeApiError(error).message,
    });
  }
};
