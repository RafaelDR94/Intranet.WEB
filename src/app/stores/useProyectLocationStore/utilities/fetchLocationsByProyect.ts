import type { AxiosResponse } from 'axios';

import type { GetProyectLocation, SetProyectLocation } from '../types';

import { ReportsLocationProyect } from '@/app/configurations/Axios/urls';
import { mapProyectLocations } from '@/app/mappings/locations/location.mapper';
import type { ProyectLocationType } from '@/app/mappings/locations/locations.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pGet } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const fetchLocationsByProyect = async (
  proyectId: string,
  set: SetProyectLocation,
  get: GetProyectLocation,
  force = false,
) => {
  const trimmed = proyectId?.trim();
  if (!trimmed) {
    set({ locations: [], lastProyectId: null });
    return;
  }

  const { lastProyectId, loadingLocations } = get();
  if (loadingLocations && lastProyectId === trimmed) return;
  if (!force && lastProyectId === trimmed) return;

  set({ loadingLocations: true, error: undefined });

  try {
    const getFn = requireGateway('get');
    const url = `${ReportsLocationProyect}?idproyect=${encodeURIComponent(trimmed)}`;
    const response: AxiosResponse = await pGet(getFn)(url);
    const raw = response.data?.data ?? [];
    const mapped: ProyectLocationType[] = mapProyectLocations(Array.isArray(raw) ? raw : []);

    set({
      locations: mapped,
      lastProyectId: trimmed,
      loadingLocations: false,
    });
    return mapped
  } catch (error) {
    set({
      loadingLocations: false,
      error: normalizeApiError(error).message,
    });
    return null
  }
};
