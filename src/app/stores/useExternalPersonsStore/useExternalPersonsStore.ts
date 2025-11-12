// src/app/stores/useExternalPersonsStore/useExternalPersonsStore.ts
"use client";

import { devtools } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

import type { ExternalPersonsState } from "./types";
import {
  fetchExternalPersons as fetchExternalPersonsRequest,
  fetchExternalPersonsByEnterprise as fetchExternalPersonsByEnterpriseRequest,
  fetchExternalPersonById as fetchExternalPersonByIdRequest,
  createExternalPerson as createExternalPersonRequest,
  updateExternalPerson as updateExternalPersonRequest,
  deleteExternalPerson as deleteExternalPersonRequest,
} from "./utilities";

const initialCollections: Pick<
  ExternalPersonsState,
  | "externalPersons"
  | "externalPersonsByEnterprise"
  | "externalPerson"
  | "currentEnterpriseId"
> = {
  externalPersons: [],
  externalPersonsByEnterprise: {},
  externalPerson: undefined,
  currentEnterpriseId: undefined,
};

const initialFlags: Pick<
  ExternalPersonsState,
  | "loading"
  | "loadingByEnterprise"
  | "loadingById"
  | "creating"
  | "updating"
  | "deleting"
  | "successGet"
  | "successGetByEnterprise"
  | "successGetById"
  | "successPost"
  | "successPut"
  | "successDelete"
  | "error"
  | "warning"
> = {
  loading: false,
  loadingByEnterprise: false,
  loadingById: false,
  creating: false,
  updating: false,
  deleting: false,
  successGet: false,
  successGetByEnterprise: false,
  successGetById: false,
  successPost: false,
  successPut: false,
  successDelete: false,
  error: undefined,
  warning: undefined,
};

export const useExternalPersonsStore = createWithEqualityFn<ExternalPersonsState>()(
  devtools((set, get) => ({
    ...initialCollections,
    ...initialFlags,

    fetchExternalPersons: (force = false) =>
      fetchExternalPersonsRequest(set, get, force),
    fetchExternalPersonsByEnterprise: (enterpriseId, force = false) =>
      fetchExternalPersonsByEnterpriseRequest(enterpriseId, set, get, force),
    fetchExternalPersonById: (id, force = false) =>
      fetchExternalPersonByIdRequest(id, set, get, force),
    createExternalPerson: (payload) =>
      createExternalPersonRequest(set, get, payload),
    updateExternalPerson: (payload) =>
      updateExternalPersonRequest(set, get, payload),
    deleteExternalPerson: (id) =>
      deleteExternalPersonRequest(set, get, id),

    reset: () => set({ ...initialCollections, ...initialFlags }),
    resetFlags: () => set({ ...initialFlags }),
  }))
);

