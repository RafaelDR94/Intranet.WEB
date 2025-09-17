'use client';
import type { AxiosResponse } from 'axios';

import { Get, Set } from '../types';

import { BillingPettyCashVoucherByIdEmployee } from '@/app/configurations/Axios/urls';
import { PettyCashVoucherByIdEmployeeMap } from '@/app/mappings/billingPettyCash/billingPettyCash.mapper';
import type { PettyCashVoucherFull } from '@/app/mappings/billingPettyCash/BillingPettyCash.types';
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError';
import { pGet } from '@/app/utilities/Http/promisifyIntranet';
import { requireGateway } from '@/app/utilities/Http/requireGateway';

export const fetchPettyCashVouchersByIdEmployee = async (
  set: Set,
  get: Get,
  idEmployee: string
): Promise<PettyCashVoucherFull[] | null> => {
  if (!idEmployee) {
    set({ error: 'idEmployee requerido para historial de vales' });
    return null;
  }

  set({ loading: true, error: undefined });

  try {
    const getReq = pGet(requireGateway('get'), [200]);
    const res: AxiosResponse = await getReq(
      `${BillingPettyCashVoucherByIdEmployee}/${idEmployee}`
    );

    const vouchers = PettyCashVoucherByIdEmployeeMap(res?.data);
    set({ vouchersFull: vouchers, loading: false });
    return vouchers;
  } catch (e) {
    const err = normalizeApiError(e);
    set({ loading: false, error: err.message });
    return null;
  }
};
