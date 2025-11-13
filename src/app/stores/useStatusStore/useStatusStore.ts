// src/app/stores/useStatusStore/useStatusStore.ts
"use client";

import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import type { StatusState } from "./types";
import {
  fetchStatuses as fetchStatusesRequest,
  fetchStatusById as fetchStatusByIdRequest,
  fetchStatusesByType as fetchStatusesByTypeRequest,
  createStatus as createStatusRequest,
  updateStatus as updateStatusRequest,
  deleteStatus as deleteStatusRequest,
} from "./utilities/fetchStatuses";

const initialCollections: Pick<StatusState, "statuses" | "current"> = {
  statuses: [],
  current: undefined,
};

const initialFlags: Pick<
  StatusState,
  | "loading"
  | "loadingById"
  | "creating"
  | "updating"
  | "deleting"
  | "successGet"
  | "successGetById"
  | "successPost"
  | "successPut"
  | "successDelete"
  | "error"
  | "warning"
> = {
  loading: false,
  loadingById: false,
  creating: false,
  updating: false,
  deleting: false,
  successGet: false,
  successGetById: false,
  successPost: false,
  successPut: false,
  successDelete: false,
  error: undefined,
  warning: undefined,
};

export const useStatusStore = createWithEqualityFn<StatusState>()(
  devtools((set, get) => ({
    ...initialCollections,
    ...initialFlags,

    fetchStatuses: (force = false) => fetchStatusesRequest(set, get, force),
    fetchStatusById: (id, force = false) =>
      fetchStatusByIdRequest(id, set, get, force),
    fetchStatusesByType: (type) =>
      fetchStatusesByTypeRequest(type, set, get),
    createStatus: (payload) => createStatusRequest(set, get, payload),
    updateStatus: (payload) => updateStatusRequest(set, get, payload),
    deleteStatus: (id) => deleteStatusRequest(id, set, get),

    reset: () => set({ ...initialCollections, ...initialFlags }),
    resetFlags: () => set({ ...initialFlags }),
  }))
);

export default useStatusStore;

