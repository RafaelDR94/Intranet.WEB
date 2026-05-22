import type { AxiosResponse } from 'axios';

import type { GetProyectLocation, SetProyectLocation } from '../types';

import { fetchAllLocations } from './fetchAllLocations';

import { ReportsLocation } from '@/app/configurations/Axios/urls';
import { mapLocationPost, mapProyectLocation } from '@/app/mappings/locations/location.mapper';
import type { LocationPost, ProyectLocationType } from '@/app/mappings/locations/locations.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pPost } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const createLocation = async (
  set: SetProyectLocation,
  get: GetProyectLocation,
  payload: LocationPost,
): Promise<ProyectLocationType | null> => {
  set({ error: undefined });

  try {
    const post = pPost(requireGateway('post'), [200, 201]);
    const res: AxiosResponse = await post(ReportsLocation, mapLocationPost(payload));
    const raw = res.data?.data ?? res.data;
    const created = raw ? mapProyectLocation(raw) : null;

    await fetchAllLocations(set, get, true);

    return created;
  } catch (error) {
    set({ error: normalizeApiError(error).message });
    return null;
  }
};
