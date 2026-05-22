// src/app/stores/useEnterprisesStore/useEnterprisesStore.ts
"use client";

import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import type { EnterprisesState } from "./types";
import {
  fetchEnterprises as fetchEnterprisesRequest,
  fetchWorkpositions as fetchWorkpositionsRequest,
  fetchWorkpositionsByDepartment as fetchWorkpositionsByDepartmentRequest,
  createEnterprise as createEnterpriseRequest,
  updateEnterprise as updateEnterpriseRequest,
  createExternalEnterprise as createExternalEnterpriseRequest,
} from "./utilities";

const initialCollections: Pick<
  EnterprisesState,
  | "enterprises"
  | "workpositions"
  | "workpositionsByEnterprise"
  | "workpositionsByDepartment"
  | "currentEnterpriseId"
  | "currentDepartmentId"
> = {
  enterprises: [],
  workpositions: [],
  workpositionsByEnterprise: {},
  workpositionsByDepartment: {},
  currentEnterpriseId: undefined,
  currentDepartmentId: undefined,
};

const initialFlags: Pick<
  EnterprisesState,
  | "loadingEnterprises"
  | "loadingWorkpositions"
  | "creating"
  | "updating"
  | "successGetEnterprises"
  | "successGetWorkpositions"
  | "successPost"
  | "successPut"
  | "error"
  | "warning"
> = {
  loadingEnterprises: false,
  loadingWorkpositions: false,
  creating: false,
  updating: false,
  successGetEnterprises: false,
  successGetWorkpositions: false,
  successPost: false,
  successPut: false,
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
    fetchWorkpositionsByDepartment: (departmentId, force = false) =>
      fetchWorkpositionsByDepartmentRequest(departmentId, set, get, force),
    createEnterprise: (payload) =>
      createEnterpriseRequest(set, get, payload),
    updateEnterprise: (payload) =>
      updateEnterpriseRequest(set, get, payload),
    createExternalEnterprise: (payload) =>
      createExternalEnterpriseRequest(set, get, payload),

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
