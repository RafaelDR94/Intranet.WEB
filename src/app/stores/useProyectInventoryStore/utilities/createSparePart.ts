'use client';

import type { AxiosResponse } from 'axios';

import type {
  GetProyectInventoryState as Get,
  SetProyectInventoryState as Set,
} from '../types';

import { fetchSpareParts } from './fetchSpareParts';

import { ReportsSpareParts } from '@/app/configurations/Axios/urls';
import { mapSparePart, mapSparePartPost } from '@/app/mappings/inventory/inventory.mapper';
import type { SparePart, SparePartPost } from '@/app/mappings/inventory/inventory.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pPost } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const createSparePart = async (
  set: Set,
  get: Get,
  payload: SparePartPost
): Promise<SparePart | null> => {
  set({ creating: true, error: undefined, successPost: false });

  try {
    const post = pPost(requireGateway('post'), [200, 201]);
    const res: AxiosResponse = await post(
      ReportsSpareParts,
      mapSparePartPost(payload)
    );
    const raw = res.data?.data ?? res.data;
    const created = raw ? mapSparePart(raw) : null;

    await fetchSpareParts(get().lastSparePartsIsActive ?? true, set, get, true);

    set({ creating: false, successPost: true });
    return created;
  } catch (e) {
    set({
      creating: false,
      successPost: false,
      error: normalizeApiError(e).message,
    });
    return null;
  }
};
