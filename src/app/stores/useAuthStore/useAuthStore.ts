'use client'
import { createWithEqualityFn } from 'zustand/traditional'
import { devtools } from 'zustand/middleware'
import type { AuthState } from './types'
import {
  login,
  authValidate,
  changePassword,
  recoverPassword,
  fetchFirebaseConfiguration,
  changeNipStatusByIdUser,
  changeNip,
  createNip,
} from './utilities'

/**
 * Store para operaciones de autenticación.
 */
export const useAuthStore = createWithEqualityFn<AuthState>()(
  devtools((set, get) => ({
    loginData: undefined,
    firebaseConfig: undefined,
    loading: false,
    recoveringPassword: false,
    successLogin: false,
    successAuthValidate: false,
    successChangePassword: false,
    successRecoverPassword: false,
    successChangeNIPStatus: false,
    successChangeNIP: false,
    successCreateNIP: false,
    successFirebaseConfig: false,
    error: undefined,

    login: (payload) => login(set, get, payload),
    authValidate: (payload) => authValidate(set, get, payload),
    changePassword: (payload) => changePassword(set, get, payload),
    recoverPassword: (payload) => recoverPassword(set, get, payload),
    fetchFirebaseConfiguration: () => fetchFirebaseConfiguration(set, get),
    changeNipStatusByIdUser: (id) => changeNipStatusByIdUser(id, set, get),
    changeNip: (payload) => changeNip(set, get, payload),
    createNip: (payload) => createNip(set, get, payload),

    reset: () =>
      set({
        loginData: undefined,
        firebaseConfig: undefined,
        loading: false,
        error: undefined,
        successLogin: false,
        successAuthValidate: false,
        successChangePassword: false,
        successRecoverPassword: false,
        successChangeNIPStatus: false,
        successChangeNIP: false,
        successCreateNIP: false,
        successFirebaseConfig: false,
        recoveringPassword: false,
      }),
    resetFlags: () =>
      set({
        loading: false,
        error: undefined,
        successLogin: false,
        successAuthValidate: false,
        successChangePassword: false,
        successRecoverPassword: false,
        successChangeNIPStatus: false,
        successChangeNIP: false,
        successCreateNIP: false,
        successFirebaseConfig: false,
        recoveringPassword: false,
      }),
  }))
)
