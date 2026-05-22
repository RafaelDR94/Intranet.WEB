'use client';

import type { AxiosResponse } from 'axios';

import type {
  GetProyectInventoryState as Get,
  SetProyectInventoryState as Set,
} from '../types';

import { fetchSuppliers } from './fetchSuppliers';

import { ReportsSuppliers } from '@/app/configurations/Axios/urls';
import { mapSupplier, mapSupplierPut } from '@/app/mappings/inventory/inventory.mapper';
import type { Supplier, SupplierPut } from '@/app/mappings/inventory/inventory.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pPut } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const updateSupplier = async (
  set: Set,
  get: Get,
  payload: SupplierPut
): Promise<Supplier | null> => {
  set({ updating: true, error: undefined, successPut: false });

  try {
    const put = pPut(requireGateway('put'), [200, 204]);
    const res: AxiosResponse = await put(ReportsSuppliers, mapSupplierPut(payload));
    const raw = res.data?.data ?? res.data;
    const updated = raw ? mapSupplier(raw) : null;

    await fetchSuppliers(set, get, true);

    if (get().currentSupplier?.id === payload.id && updated) {
      set({ currentSupplier: updated, lastSupplierId: payload.id });
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
