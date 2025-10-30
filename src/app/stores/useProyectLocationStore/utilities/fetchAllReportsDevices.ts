import type { AxiosResponse } from 'axios';

import type { GetProyectLocation, SetProyectLocation } from '../types';

import { ReportsDevices } from '@/app/configurations/Axios/urls';
import { mapReportDevicesExternal } from '@/app/mappings/reports/report.mapper';
import type { ReportDeviceView } from '@/app/mappings/reports/reports.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pGet } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const fetchAllReportsDevices = async (
  set: SetProyectLocation,
  get: GetProyectLocation,
  force = false,
) => {
  const { allDevices } = get();
  if (!force && allDevices.length > 0) return;

  set({ loadingAllDevices: true, error: undefined });

  try {
    const getFn = requireGateway('get');
    const response: AxiosResponse = await pGet(getFn)(ReportsDevices);
    const raw = response.data?.data ?? [];
    const mapped: ReportDeviceView[] = mapReportDevicesExternal(Array.isArray(raw) ? raw : []);

    set({ allDevices: mapped, loadingAllDevices: false });
  } catch (error) {
    set({ loadingAllDevices: false, error: normalizeApiError(error).message });
  }
};
