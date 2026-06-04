"use client";

import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import type { SAPKeysState } from "./types";
import {
  createSAPKey,
  deleteSAPKey,
  fetchSAPKeyById,
  fetchSAPKeys,
  updateSAPKey,
} from "./utilities";

const initialCollections: Pick<SAPKeysState, "sapKeys" | "sapKey"> = {
  sapKeys: [],
  sapKey: undefined,
};

const initialFlags: Pick<
  SAPKeysState,
  | "loadingSAPKeys"
  | "loadingSAPKey"
  | "creatingSAPKey"
  | "updatingSAPKey"
  | "deletingSAPKey"
  | "successGetSAPKeys"
  | "successGetSAPKey"
  | "successCreateSAPKey"
  | "successUpdateSAPKey"
  | "successDeleteSAPKey"
  | "error"
  | "warning"
> = {
  loadingSAPKeys: false,
  loadingSAPKey: false,
  creatingSAPKey: false,
  updatingSAPKey: false,
  deletingSAPKey: false,
  successGetSAPKeys: false,
  successGetSAPKey: false,
  successCreateSAPKey: false,
  successUpdateSAPKey: false,
  successDeleteSAPKey: false,
  error: undefined,
  warning: undefined,
};

export const useSAPKeysStore = createWithEqualityFn<SAPKeysState>()(
  devtools((set, get) => ({
    ...initialCollections,
    ...initialFlags,

    fetchSAPKeys: (force = false) => fetchSAPKeys(set, get, force),
    fetchSAPKeyById: (id, force = false) =>
      fetchSAPKeyById(id, set, get, force),
    createSAPKey: (payload) => createSAPKey(set, get, payload),
    updateSAPKey: (payload) => updateSAPKey(set, get, payload),
    deleteSAPKey: (id) => deleteSAPKey(set, get, id),

    reset: () =>
      set({
        ...initialCollections,
        ...initialFlags,
      }),
    resetFlags: () =>
      set({
        ...initialFlags,
      }),
  })),
);

export default useSAPKeysStore;
