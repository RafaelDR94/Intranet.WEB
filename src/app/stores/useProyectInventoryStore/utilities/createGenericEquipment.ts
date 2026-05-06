'use client';

import type { AxiosResponse } from 'axios';

import type {
  GetProyectInventoryState as Get,
  SetProyectInventoryState as Set,
} from '../types';

import { fetchGenericEquipments } from './fetchGenericEquipments';

import { ReportsGenericEquipment } from '@/app/configurations/Axios/urls';
import {
  mapGenericEquipment,
  mapGenericEquipmentPost,
} from '@/app/mappings/inventory/inventory.mapper';
import type {
  GenericEquipment,
  GenericEquipmentPost,
} from '@/app/mappings/inventory/inventory.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pPost } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const createGenericEquipment = async (
  set: Set,
  get: Get,
  payload: GenericEquipmentPost
): Promise<GenericEquipment | null> => {
  set({ creating: true, error: undefined, successPost: false });

  try {
    const post = pPost(requireGateway('post'), [200, 201]);
    const res: AxiosResponse = await post(
      ReportsGenericEquipment,
      mapGenericEquipmentPost(payload)
    );
    const raw = res.data?.data ?? res.data;
    const created = raw ? mapGenericEquipment(raw) : null;

    await fetchGenericEquipments(set, get, true);

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
