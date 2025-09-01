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
} from './utilities'
import {
  authenticateUser,
  readUser,
  logoutUser,
  validateOTP,
  sendOTPEmail,
  saveUser,
  saveLastUserRemebered,
  readUserRemebered,
  forgetUser,
} from '@/app/context/AuthContext/utilities/AuthService'
import { intranetClient } from '@/app/configurations/Axios/Clients'

let interceptorId: number | null = null

const setInterceptor = (token: string | null) => {
  if (interceptorId !== null) {
    intranetClient.interceptors.request.eject(interceptorId)
  }
  if (token) {
    interceptorId = intranetClient.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        window.location.href = '/Login'
        return Promise.reject(error)
      }
    )
  }
}

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

    login: async (credentials) => {
      set({ loading: true, error: undefined, hasExpired: false })
      try {
        await authenticateUser(credentials, get().remeberMe, get().offlineMode)
        const userDoc = await readUser()
        if (userDoc) {
          set({ user: userDoc.user, token: userDoc.user.token, successLogin: true })
          setInterceptor(userDoc.user.token)
        }
      } catch (e: any) {
        set({ error: e?.message ?? 'login error', successLogin: false })
        throw e
      } finally {
        set({ loading: false })
      }
    },
    logout: async () => {
      await logoutUser()
      set({ user: null, token: null })
      setInterceptor(null)

      const firebaseToken = localStorage.getItem('firebaseTokenDoc')
      const deviceId = localStorage.getItem('deviceIdDoc')
      localStorage.clear()
      if (firebaseToken) localStorage.setItem('firebaseTokenDoc', firebaseToken)
      if (deviceId) localStorage.setItem('deviceIdDoc', deviceId)
      sessionStorage.clear()
    },
    verifyOTP: async (optcode) => {
      await validateOTP(get().token ?? '', optcode)
      const userDoc = await readUser()
      if (userDoc) {
        set({ user: userDoc.user, token: userDoc.user.token })
        setInterceptor(userDoc.user.token)
      }
    },
    askforOTPemail: async () => {
      await sendOTPEmail(get().token ?? '')
    },
    validLoggin: async () => {
      const { user, offlineMode } = get()
      if (user) {
        const lifeTokenDate = new Date(user.lifeToken.replace('Z', ''))
        const currentDate = new Date()
        if (currentDate >= lifeTokenDate && !offlineMode) {
          set({ hasExpired: true })
          return false
        }
        return true
      }
      return false
    },
    UpdateUser: async (user) => {
      await saveUser(user)
      await saveLastUserRemebered(user)
      set({ user })
    },
    setHasExpired: (value) => set({ hasExpired: value }),
    handleRemeberMe: (rememberme) => set({ remeberMe: rememberme }),
    handleForgetUser: async () => {
      await forgetUser()
      set({ remeberMe: false, userRemebered: null })
    },
    handleOfflineMode: (offline) => {
      set({ offlineMode: offline })
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CACHE_ONLY_MODE',
          payload: offline === true,
        })
      }
    },
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
    if (rememberedDoc) {
      useAuthStore.setState({ remeberMe: true, userRemebered: rememberedDoc.user })
    }
  } catch {
    // ignore initialization errors in non-browser environments
  }
}

initAuthStore()
