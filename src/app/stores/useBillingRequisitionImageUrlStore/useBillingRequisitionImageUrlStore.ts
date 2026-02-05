"use client";
import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import type { BillingRequisitionImageUrlState } from "./types";
import {
  fetchBillingRequisitionImageUrlById,
  updateBillingRequisitionImageUrl,
} from "./utilities";

/**
 * Store global para evidencia de aprobaciÃ³n en requisiciones.
 */
export const useBillingRequisitionImageUrlStore =
  createWithEqualityFn<BillingRequisitionImageUrlState>()(
    devtools((set, get) => ({
      requisitionImage: undefined,
      loading: false,
      updating: false,
      successGet: false,
      successPut: false,
      error: undefined,
      fetchRequisitionImageUrlById: (id, force = false) =>
        fetchBillingRequisitionImageUrlById(id, set, get, force),
      updateRequisitionImageUrl: (payload) =>
        updateBillingRequisitionImageUrl(set, get, payload),
      reset: () =>
        set({
          requisitionImage: undefined,
          loading: false,
          updating: false,
          successGet: false,
          successPut: false,
          error: undefined,
        }),
      resetFlags: () =>
        set({
          loading: false,
          updating: false,
          successGet: false,
          successPut: false,
          error: undefined,
        }),
    })),
  );
