// src/app/stores/useEnterprisesStore/useEnterprisesStore.ts
"use client";

import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import type { EnterprisesState } from "./types";
import {
  fetchEnterprises as fetchEnterprisesRequest,
  fetchWorkpositions as fetchWorkpositionsRequest,
} from "./utilities";

const initialCollections: Pick<
  EnterprisesState,
  "enterprises" | "workpositions" | "workpositionsByEnterprise" | "currentEnterpriseId"
> = {
  enterprises: [],
  workpositions: [],
  workpositionsByEnterprise: {},
  currentEnterpriseId: undefined,
};

const initialFlags: Pick<
  EnterprisesState,
  | "loadingEnterprises"
  | "loadingWorkpositions"
  | "successGetEnterprises"
  | "successGetWorkpositions"
  | "error"
  | "warning"
> = {
  loadingEnterprises: false,
  loadingWorkpositions: false,
  successGetEnterprises: false,
  successGetWorkpositions: false,
  error: undefined,
  warning: undefined,
};

export const useEnterprisesStore = createWithEqualityFn<EnterprisesState>()(
  devtools((set, get) => ({
    ...initialCollections,
    ...initialFlags,

    fetchEnterprises: (force = false) =>
      fetchEnterprisesRequest(set, get, force),
    fetchWorkpositions: (enterpriseId, force = false) =>
      fetchWorkpositionsRequest(enterpriseId, set, get, force),

    reset: () =>
      set({
        ...initialCollections,
        ...initialFlags,
      }),
    resetFlags: () =>
      set({
        ...initialFlags,
      }),
  }))
);
