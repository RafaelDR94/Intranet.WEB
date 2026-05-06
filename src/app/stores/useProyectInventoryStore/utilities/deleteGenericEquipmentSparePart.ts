'use client';

import type { AxiosResponse } from 'axios';

import type {
  GetProyectInventoryState as Get,
  SetProyectInventoryState as Set,
} from '../types';

import { ReportsGenericEquipmentSpareParts } from '@/app/configurations/Axios/urls';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pDelete } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const deleteGenericEquipmentSparePart = async (
  set: Set,
  _get: Get,
  id: string
): Promise<boolean> => {
  set({ removing: true, error: undefined, successDelete: false });

  try {
    const del = pDelete(requireGateway('del'), [200, 204]);
    const _res: AxiosResponse = await del(
      `${ReportsGenericEquipmentSpareParts}/${id}`
    );

    set((state) => ({
      genericEquipmentSpareParts: state.genericEquipmentSpareParts.filter(
        (item) => item.id !== id
      ),
      removing: false,
      successDelete: true,
    }));

    return true;
  } catch (e) {
    set({
      removing: false,
      successDelete: false,
      error: normalizeApiError(e).message,
    });
    return false;
  }
};
