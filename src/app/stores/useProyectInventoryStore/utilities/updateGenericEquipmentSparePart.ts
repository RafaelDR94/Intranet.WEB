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
  mapGenericEquipmentSparePartPut,
} from '@/app/mappings/inventory/inventory.mapper';
import type {
  GenericEquipmentSparePart,
  GenericEquipmentSparePartPut,
} from '@/app/mappings/inventory/inventory.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pPut } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const updateGenericEquipmentSparePart = async (
  set: Set,
  get: Get,
  payload: GenericEquipmentSparePartPut
): Promise<GenericEquipmentSparePart | null> => {
  set({ updating: true, error: undefined, successPut: false });

  try {
    const put = pPut(requireGateway('put'), [200, 204]);
    const res: AxiosResponse = await put(
      ReportsGenericEquipmentSpareParts,
      mapGenericEquipmentSparePartPut(payload)
    );
    const raw = res.data?.data ?? res.data;
    const updated = raw ? mapGenericEquipmentSparePart(raw) : null;

    await fetchGenericEquipmentSpareParts(
      get().lastGenericEquipmentSparePartsIsActive ?? true,
      set,
      get,
      true
    );

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
