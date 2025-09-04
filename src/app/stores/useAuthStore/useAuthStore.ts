'use client'
import { createWithEqualityFn } from 'zustand/traditional'
import { devtools } from 'zustand/middleware'
import type { AuthState } from './types'
import {
  authValidate,
  changePassword,
  recoverPassword,
  fetchFirebaseConfiguration,
  changeNipStatusByIdUser,
  changeNip,
  createNip,
  login,
  logout,
  verifyOTP,
  askforOTPemail,
  validLoggin,
  updateUser,
  handleRemeberMe,
  handleForgetUser,
  handleOfflineMode,
  setInterceptor,
  updateUserPermissions
} from './utilities'
import { readUser, readUserRemebered } from '@/app/context/AuthContext/utilities/AuthService'

/**
 * Store para operaciones de autenticación.
 */
export const useAuthStore = createWithEqualityFn<AuthState>()(
  devtools((set, get) => ({
    loginData: undefined,
    firebaseConfig: undefined,
    user: null,
    userRemebered: null,
    token: null,
    hasExpired: false,
    remeberMe: false,
    offlineMode: false,
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

    login: (credentials) => login(set, get, credentials),
    logout: () => logout(set),
    verifyOTP: (optcode) => verifyOTP(set, get, optcode),
    askforOTPemail: () => askforOTPemail(set, get),
    validLoggin: () => validLoggin(set, get),
    UpdateUser: (user) => updateUser(set, get, user),
    setHasExpired: (value) => set({ hasExpired: value }),
    handleRemeberMe: (rememberme) => handleRemeberMe(set, rememberme),
    handleForgetUser: () => handleForgetUser(set),
    handleOfflineMode: (offline) => handleOfflineMode(set, offline),
    authValidate: (payload) => authValidate(set, get, payload),
    changePassword: (payload) => changePassword(set, get, payload),
    recoverPassword: (payload) => recoverPassword(set, get, payload),
    fetchFirebaseConfiguration: () => fetchFirebaseConfiguration(set, get),
    changeNipStatusByIdUser: (id) => changeNipStatusByIdUser(id, set, get),
    changeNip: (payload) => changeNip(set, get, payload),
    createNip: (payload) => createNip(set, get, payload),
    updateUserPermissions: (permissions: string) => updateUserPermissions(set, get, permissions),
    reset: () =>
      set({
        loginData: undefined,
        firebaseConfig: undefined,
        user: null,
        userRemebered: null,
        token: null,
        hasExpired: false,
        remeberMe: false,
        offlineMode: false,
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
        hasExpired: false,
      }),
  }))
)

const initAuthStore = async () => {
  try {
    const userDoc = await readUser()
    if (userDoc) {
      useAuthStore.setState({ user: userDoc.user, token: userDoc.user.token })
      setInterceptor(userDoc.user.token)
    }
    const rememberedDoc = await readUserRemebered()
    if (rememberedDoc?.user?.email) {
      useAuthStore.setState({ remeberMe: true, userRemebered: rememberedDoc.user })
    }
  } catch {
    // ignore initialization errors
  }
}

initAuthStore()
