'use client'

import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { AuthorizationsState } from './types'
import {
  createAuthorization,
  getAuthorizations,
  getAuthorizationsByIdAuthorizer,
  getAuthorizationTypes,
  updateAuthorizationAuthorizer,
  approveAuthorization,
  rejectAuthorization,
} from './utilities'

const normalizeText = (value: string) =>
  value
    .toLocaleLowerCase('es-MX')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

/**
 * Store global para autorizaciones.
 */
export const useAuthorizationsStore = createWithEqualityFn<AuthorizationsState>()(
  devtools((set, get) => ({
    authorizations: [],
    authorizationTypes: [],
    loading: false,
    loadingTypes: false,
    creating: false,
    updatingStatus: false,
    updatingAuthorizer: false,
    successGet: false,
    successGetTypes: false,
    successCreate: false,
    successUpdateStatus: false,
    successUpdateAuthorizer: false,
    error: undefined,

    getAuthorizations: (force = false) => getAuthorizations(set, get, force),
    getAuthorizationsByIdAuthorizer: (idAuthorizer, force = false) =>
      getAuthorizationsByIdAuthorizer(set, get, idAuthorizer, force),
    getAuthorizationTypes: (force = false) => getAuthorizationTypes(set, get, force),
    createAuthorization: (payload) => createAuthorization(set, get, payload),
    updateAuthorizationAuthorizer: (authorizationId, payload) =>
      updateAuthorizationAuthorizer(set, get, authorizationId, payload),
    approveAuthorization: (authorizationId) => approveAuthorization(set, get, authorizationId),
    rejectAuthorization: (authorizationId, comment) =>
      rejectAuthorization(set, get, authorizationId, comment),
    resolveAuthorizationTypeId: (name) => {
      const normalized = normalizeText(name ?? '')
      return get().authorizationTypes.find(
        (type) => normalizeText(type.name) === normalized,
      )?.id
    },
    resolveAuthorizationTypeName: (id) => {
      if (!id) return undefined
      return get().authorizationTypes.find((type) => type.id === id)?.name
    },

    reset: () =>
      set({
        authorizations: [],
        authorizationTypes: [],
        loading: false,
        loadingTypes: false,
        creating: false,
        updatingStatus: false,
        updatingAuthorizer: false,
        successGet: false,
        successGetTypes: false,
        successCreate: false,
        successUpdateStatus: false,
        successUpdateAuthorizer: false,
        error: undefined,
      }),

    resetFlags: () =>
      set({
        loading: false,
        loadingTypes: false,
        creating: false,
        updatingStatus: false,
        updatingAuthorizer: false,
        successGet: false,
        successGetTypes: false,
        successCreate: false,
        successUpdateStatus: false,
        successUpdateAuthorizer: false,
        error: undefined,
      }),
  })),
)
