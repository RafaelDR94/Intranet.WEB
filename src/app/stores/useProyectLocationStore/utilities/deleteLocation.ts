import type { AxiosResponse } from 'axios';

import type { GetProyectLocation, SetProyectLocation } from '../types';

import { ReportsLocation } from '@/app/configurations/Axios/urls';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pDelete } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const deleteLocation = async (
  set: SetProyectLocation,
  _get: GetProyectLocation,
  id: string,
): Promise<boolean> => {
  set({ error: undefined });

  try {
    const del = pDelete(requireGateway('del'), [200, 204]);
    const _res: AxiosResponse = await del(
      `${ReportsLocation}?id=${encodeURIComponent(id)}`,
    );

    set((state) => ({
      locations: state.locations.filter((location) => location.id !== id),
    }));

    return true;
  } catch (error) {
    set({ error: normalizeApiError(error).message });
    return false;
  }
};
