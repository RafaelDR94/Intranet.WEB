import type { AxiosResponse } from 'axios';

import type { GetProyectLocation, SetProyectLocation } from '../types';

import { ReportsLocation } from '@/app/configurations/Axios/urls';
import { mapProyectLocations } from '@/app/mappings/locations/location.mapper';
import type { ProyectLocationType } from '@/app/mappings/locations/locations.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pGet } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const fetchAllLocations = async (
  set: SetProyectLocation,
  get: GetProyectLocation,
  force = false,
): Promise<ProyectLocationType[] | null> => {
  if (!force && get().locations.length > 0 && !get().lastProyectId) {
    return get().locations;
  }

  set({ loadingLocations: true, error: undefined });

  try {
    const getFn = requireGateway('get');
    const response: AxiosResponse = await pGet(getFn)(ReportsLocation);
    const raw = response.data?.data ?? response.data ?? [];
    const mapped: ProyectLocationType[] = mapProyectLocations(Array.isArray(raw) ? raw : []);

    set({
      locations: mapped,
      lastProyectId: null,
      loadingLocations: false,
    });

    return mapped;
  } catch (error) {
    set({
      loadingLocations: false,
      error: normalizeApiError(error).message,
    });
    return null;
  }
};
