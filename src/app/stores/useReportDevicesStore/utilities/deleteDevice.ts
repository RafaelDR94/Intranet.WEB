import type { GetReportDevicesState, SetReportDevicesState } from '../types';

import { ReportsDevices } from '@/app/configurations/Axios/urls';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pDelete } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const deleteDevice = async (
  set: SetReportDevicesState,
  get: GetReportDevicesState,
  id: string,
): Promise<boolean> => {
  const trimmed = id?.trim();
  if (!trimmed) return false;

  set({ removing: true, error: undefined, successDelete: false });

  try {
    const del = pDelete(requireGateway('del'), [200, 204]);
    const url = `${ReportsDevices}/${encodeURIComponent(trimmed)}`;
    await del(url);

    set((state) => ({
      devices: state.devices.filter((device) => device.id !== trimmed),
      locationDevices: state.locationDevices.filter((device) => device.id !== trimmed),
    }));

    await get().fetchDevices(true);
    const { lastLocationId } = get();
    if (lastLocationId) {
      await get().fetchDevicesByLocation(lastLocationId, true);
    }

    set({ removing: false, successDelete: true });
    return true;
  } catch (error) {
    set({ removing: false, successDelete: false, error: normalizeApiError(error).message });
    return false;
  }
};
