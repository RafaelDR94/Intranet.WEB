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
  mapGenericEquipmentPut,
} from '@/app/mappings/inventory/inventory.mapper';
import type {
  GenericEquipment,
  GenericEquipmentPut,
} from '@/app/mappings/inventory/inventory.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pPut } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const updateGenericEquipment = async (
  set: Set,
  get: Get,
  payload: GenericEquipmentPut
): Promise<GenericEquipment | null> => {
  set({ updating: true, error: undefined, successPut: false });

  try {
    const put = pPut(requireGateway('put'), [200, 204]);
    const res: AxiosResponse = await put(
      ReportsGenericEquipment,
      mapGenericEquipmentPut(payload)
    );
    const raw = res.data?.data ?? res.data;
    const updated = raw ? mapGenericEquipment(raw) : null;

    await fetchGenericEquipments(set, get, true);

    if (get().currentGenericEquipment?.id === payload.id && updated) {
      set({ currentGenericEquipment: updated, lastGenericEquipmentId: payload.id });
    }

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
