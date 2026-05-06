'use client';

import type { AxiosResponse } from 'axios';

import type {
  GetProyectInventoryState as Get,
  SetProyectInventoryState as Set,
} from '../types';

import { fetchGenericEquipmentSpareParts } from './fetchGenericEquipmentSpareParts';

import { ReportsGenericEquipmentSpareParts } from '@/app/configurations/Axios/urls';
import {
  mapGenericEquipmentSparePart,
  mapGenericEquipmentSparePartPost,
} from '@/app/mappings/inventory/inventory.mapper';
import type {
  GenericEquipmentSparePart,
  GenericEquipmentSparePartPost,
} from '@/app/mappings/inventory/inventory.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pPost } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const createGenericEquipmentSparePart = async (
  set: Set,
  get: Get,
  payload: GenericEquipmentSparePartPost
): Promise<GenericEquipmentSparePart | null> => {
  set({ creating: true, error: undefined, successPost: false });

  try {
    const post = pPost(requireGateway('post'), [200, 201]);
    const res: AxiosResponse = await post(
      ReportsGenericEquipmentSpareParts,
      mapGenericEquipmentSparePartPost(payload)
    );
    const raw = res.data?.data ?? res.data;
    const created = raw ? mapGenericEquipmentSparePart(raw) : null;

    await fetchGenericEquipmentSpareParts(
      get().lastGenericEquipmentSparePartsIsActive ?? true,
      set,
      get,
      true
    );

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
