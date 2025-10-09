import type { AxiosResponse } from 'axios';

import type {
  GetReportDevicesState,
  ReportDeviceCreatePayload,
  SetReportDevicesState,
} from '../types';
import { mapToReportDeviceView } from './mapToReportDeviceView';

import { ReportsDevices } from '@/app/configurations/Axios/urls';
import type { ReportDeviceView } from '@/app/mappings/reports/reports.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pPost } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const createDevice = async (
  set: SetReportDevicesState,
  get: GetReportDevicesState,
  payload: ReportDeviceCreatePayload,
): Promise<ReportDeviceView | null> => {
  set({ creating: true, error: undefined, successPost: false });

  try {
    const post = pPost(requireGateway('post'), [200, 201]);
    const response: AxiosResponse = await post(ReportsDevices, payload);
    const created = mapToReportDeviceView(response.data?.data);

    await get().fetchDevices(true);

    const { lastLocationId } = get();
    if (lastLocationId) {
      await get().fetchDevicesByLocation(lastLocationId, true);
    }

    set({ creating: false, successPost: true });
    return created;
  } catch (error) {
    set({ creating: false, successPost: false, error: normalizeApiError(error).message });
    return null;
  }
};
