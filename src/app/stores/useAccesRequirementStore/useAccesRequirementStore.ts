// src/app/stores/useAccesRequirementStore/useAccesRequirementStore.ts
"use client";

import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import type { AccesRequirementsState } from "./types";
import {
  createAccesRequirement as createAccesRequirementRequest,
  deleteAccesRequirement as deleteAccesRequirementRequest,
  fetchAccesRequirementById as fetchAccesRequirementByIdRequest,
  fetchAccesRequirements as fetchAccesRequirementsRequest,
  updateAccesRequirement as updateAccesRequirementRequest,
} from "./utilities";

const initialCollections: Pick<
  AccesRequirementsState,
  "accesRequirements" | "current"
> = {
  accesRequirements: [],
  current: undefined,
};

const initialFlags: Pick<
  AccesRequirementsState,
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

export const useAccesRequirementStore = createWithEqualityFn<AccesRequirementsState>()(
  devtools((set, get) => ({
    ...initialCollections,
    ...initialFlags,

    fetchAccesRequirements: (force = false) =>
      fetchAccesRequirementsRequest(set, get, force),
    fetchAccesRequirementById: (id, force = false) =>
      fetchAccesRequirementByIdRequest(id, set, get, force),
    createAccesRequirement: (payload) =>
      createAccesRequirementRequest(set, get, payload),
    updateAccesRequirement: (payload) =>
      updateAccesRequirementRequest(set, get, payload),
    deleteAccesRequirement: (id) =>
      deleteAccesRequirementRequest(set, get, id),

    reset: () => set({ ...initialCollections, ...initialFlags }),
    resetFlags: () => set({ ...initialFlags }),
  }))
);

