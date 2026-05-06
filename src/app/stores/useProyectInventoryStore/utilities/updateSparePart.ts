'use client';

import type { AxiosResponse } from 'axios';

import type {
  GetProyectInventoryState as Get,
  SetProyectInventoryState as Set,
} from '../types';

import { fetchSpareParts } from './fetchSpareParts';

import { ReportsSpareParts } from '@/app/configurations/Axios/urls';
import { mapSparePart, mapSparePartPut } from '@/app/mappings/inventory/inventory.mapper';
import type { SparePart, SparePartPut } from '@/app/mappings/inventory/inventory.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pPut } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const updateSparePart = async (
  set: Set,
  get: Get,
  payload: SparePartPut
): Promise<SparePart | null> => {
  set({ updating: true, error: undefined, successPut: false });

  try {
    const put = pPut(requireGateway('put'), [200, 204]);
    const res: AxiosResponse = await put(
      ReportsSpareParts,
      mapSparePartPut(payload)
    );
    const raw = res.data?.data ?? res.data;
    const updated = raw ? mapSparePart(raw) : null;

    await fetchSpareParts(get().lastSparePartsIsActive ?? true, set, get, true);

    set({ updating: false, successPut: true });
    return updated;
  } catch (e) {
    set({
      updating: false,
      successPut: false,
      error: normalizeApiError(e).message,
    });
    return null;
  }
};
