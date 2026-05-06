'use client';

import type { AxiosResponse } from 'axios';

import type {
  GetProyectInventoryState as Get,
  SetProyectInventoryState as Set,
} from '../types';

import { ReportsGenericEquipment } from '@/app/configurations/Axios/urls';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pDelete } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const deleteGenericEquipment = async (
  set: Set,
  get: Get,
  id: string
): Promise<boolean> => {
  set({ removing: true, error: undefined, successDelete: false });

  try {
    const del = pDelete(requireGateway('del'), [200, 204]);
    const _res: AxiosResponse = await del(`${ReportsGenericEquipment}/${id}`);

    set((state) => ({
      genericEquipments: state.genericEquipments.filter((item) => item.id !== id),
      currentGenericEquipment:
        get().currentGenericEquipment?.id === id
          ? null
          : state.currentGenericEquipment,
      lastGenericEquipmentId:
        get().lastGenericEquipmentId === id ? null : state.lastGenericEquipmentId,
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
