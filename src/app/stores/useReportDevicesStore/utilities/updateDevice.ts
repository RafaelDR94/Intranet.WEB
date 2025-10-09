import type { AxiosResponse } from 'axios';

import type {
  GetReportDevicesState,
  ReportDeviceUpdatePayload,
  SetReportDevicesState,
} from '../types';
import { mapToReportDeviceView } from './mapToReportDeviceView';

import { ReportsDevices } from '@/app/configurations/Axios/urls';
import type { ReportDeviceView } from '@/app/mappings/reports/reports.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pPut } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const updateDevice = async (
  set: SetReportDevicesState,
  get: GetReportDevicesState,
  payload: ReportDeviceUpdatePayload,
): Promise<ReportDeviceView | null> => {
  set({ updating: true, error: undefined, successPut: false });

  try {
    const put = pPut(requireGateway('put'), [200, 204]);
    const response: AxiosResponse = await put(ReportsDevices, payload);
    const updated = mapToReportDeviceView(response.data?.data);

    await get().fetchDevices(true);

    const { lastLocationId } = get();
    if (lastLocationId) {
      await get().fetchDevicesByLocation(lastLocationId, true);
    }

    set({ updating: false, successPut: true });
    return updated;
  } catch (error) {
    set({ updating: false, successPut: false, error: normalizeApiError(error).message });
    return null;
  }
};
