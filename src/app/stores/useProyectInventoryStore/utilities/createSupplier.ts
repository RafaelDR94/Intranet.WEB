'use client';

import type { AxiosResponse } from 'axios';

import type {
  GetProyectInventoryState as Get,
  SetProyectInventoryState as Set,
} from '../types';

import { fetchSuppliers } from './fetchSuppliers';

import { ReportsSuppliers } from '@/app/configurations/Axios/urls';
import { mapSupplier, mapSupplierPost } from '@/app/mappings/inventory/inventory.mapper';
import type { Supplier, SupplierPost } from '@/app/mappings/inventory/inventory.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pPost } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const createSupplier = async (
  set: Set,
  get: Get,
  payload: SupplierPost
): Promise<Supplier | null> => {
  set({ creating: true, error: undefined, successPost: false });

  try {
    const post = pPost(requireGateway('post'), [200, 201]);
    const res: AxiosResponse = await post(ReportsSuppliers, mapSupplierPost(payload));
    const raw = res.data?.data ?? res.data;
    const created = raw ? mapSupplier(raw) : null;

    await fetchSuppliers(set, get, true);

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
