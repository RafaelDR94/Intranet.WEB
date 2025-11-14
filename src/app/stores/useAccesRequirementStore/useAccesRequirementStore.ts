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
  updateInternalComments as updateInternalCommentsRequest,
  updateExternalComments as updateExternalCommentsRequest,
  generateTemplate as generateTemplateRequest,
} from "./utilities";
import { AccesRequirmentGet } from "@/app/mappings/accesrequest/accesrequest.types";

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
  | "templating"
  | "successGet"
  | "successGetById"
  | "successPost"
  | "successPut"
  | "successDelete"
  | "successTemplate"
  | "error"
  | "warning"
  | "templateError"
> = {
  loading: false,
  loadingById: false,
  creating: false,
  updating: false,
  deleting: false,
  templating: false,
  successGet: false,
  successGetById: false,
  successPost: false,
  successPut: false,
  successDelete: false,
  successTemplate: false,
  error: undefined,
  warning: undefined,
  templateError: undefined,
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
    updateInternalComments: (payload) =>
      updateInternalCommentsRequest(set, get, payload),
    updateExternalComments: (payload) =>
      updateExternalCommentsRequest(set, get, payload),
    generateTemplate: (id) =>
      generateTemplateRequest(set, get, id),
    deleteAccesRequirement: (id) =>
      deleteAccesRequirementRequest(set, get, id),
    reset: () => set({ ...initialCollections, ...initialFlags }),
    setCurrent: (acces: AccesRequirmentGet | undefined) => set({current: acces}),
    resetFlags: () => set({ ...initialFlags }),
  }))
);

