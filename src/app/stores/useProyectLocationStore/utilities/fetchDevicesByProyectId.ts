import type { AxiosResponse } from 'axios';

import type { GetProyectLocation, SetProyectLocation } from '../types';

import { ReportsDevicesByProyectId } from '@/app/configurations/Axios/urls';
import { mapReportDevicesExternal } from '@/app/mappings/reports/report.mapper';
import type { ReportDeviceView } from '@/app/mappings/reports/reports.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pGet } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const fetchDevicesByProyectId = async (
  proyectId: string,
  set: SetProyectLocation,
  get: GetProyectLocation,
  force = false,
) => {
  const trimmed = proyectId?.trim();
  if (!trimmed) {
    set({ devicesByProyect: [], lastDevicesByProyectId: null });
    return;
  }

  const { lastDevicesByProyectId, devicesByProyect } = get();
  if (!force && lastDevicesByProyectId === trimmed && devicesByProyect.length > 0) return;

  set({ loadingDevicesByProyect: true, error: undefined });

  try {
    const getFn = requireGateway('get');
    const url = `${ReportsDevicesByProyectId}/${encodeURIComponent(trimmed)}`;
    const response: AxiosResponse = await pGet(getFn)(url);
    const raw = response.data?.data ?? [];
    const mapped: ReportDeviceView[] = mapReportDevicesExternal(Array.isArray(raw) ? raw : []);

    set({
      devicesByProyect: mapped,
      lastDevicesByProyectId: trimmed,
      loadingDevicesByProyect: false,
    });
  } catch (error) {
    set({
      loadingDevicesByProyect: false,
      error: normalizeApiError(error).message,
    });
  }
};
