import type { AxiosResponse } from 'axios';

import type { GetReportDevicesState, SetReportDevicesState } from '../types';

import { ReportsDevicesByLocation } from '@/app/configurations/Axios/urls';
import { mapReportDevicesExternal } from '@/app/mappings/reports/report.mapper';
import type { ReportDeviceView } from '@/app/mappings/reports/reports.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pGet } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const fetchDevicesByLocation = async (
  locationId: string,
  set: SetReportDevicesState,
  get: GetReportDevicesState,
  force = false,
): Promise<ReportDeviceView[]> => {

  const trimmed = locationId?.trim();
  if (!trimmed) {
    set({ locationDevices: [], lastLocationId: null });
    return [];
  }

  const { lastLocationId, locationDevices } = get();
  if (!force && lastLocationId === trimmed && locationDevices.length > 0) return locationDevices;

  set({ loadingByLocation: true, error: undefined, successGetByLocation: false });

  try {
    const getFn = requireGateway('get');
    const url = `${ReportsDevicesByLocation}/${encodeURIComponent(trimmed)}`;
    const response: AxiosResponse = await pGet(getFn)(url);
    const raw = response.data?.data ?? [];
    const mapped = mapReportDevicesExternal(Array.isArray(raw) ? raw : []);

    set({
      locationDevices: mapped,
      lastLocationId: trimmed,
      loadingByLocation: false,
      successGetByLocation: true,
    });
    return mapped;
  } catch (error) {
    set({
      loadingByLocation: false,
      successGetByLocation: false,
      error: normalizeApiError(error).message,
    });
    return [];
  }
};
