import type { AxiosResponse } from 'axios';

import type { GetProyectLocation, SetProyectLocation } from '../types';

import { fetchAllLocations } from './fetchAllLocations';

import { ReportsLocation } from '@/app/configurations/Axios/urls';
import { mapLocationPut, mapProyectLocation } from '@/app/mappings/locations/location.mapper';
import type { LocationPut, ProyectLocationType } from '@/app/mappings/locations/locations.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pPut } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const updateLocation = async (
  set: SetProyectLocation,
  get: GetProyectLocation,
  payload: LocationPut,
): Promise<ProyectLocationType | null> => {
  set({ error: undefined });

  try {
    const put = pPut(requireGateway('put'), [200, 204]);
    const res: AxiosResponse = await put(ReportsLocation, mapLocationPut(payload));
    const raw = res.data?.data ?? res.data;
    const updated = raw ? mapProyectLocation(raw) : null;

    await fetchAllLocations(set, get, true);

    return updated;
  } catch (error) {
    set({ error: normalizeApiError(error).message });
    return null;
  }
};
