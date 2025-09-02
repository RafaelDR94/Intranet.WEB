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
        if (typeof window !== 'undefined') window.location.href = '/login'
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

        // Mantén comportamiento previo si otras partes dependen de esto
        try {
          const remember = get().remeberMe
          if (remember && userDoc?.user?.email) {
            await saveLastUserRemebered({ user: { email: userDoc.user.email }, } as any)
            set({ userRemebered: { email: userDoc.user.email }, } as any)
          } else {
            await forgetUser()
            set({ userRemebered: null })
          }
        } catch { /* noop */ }

      } catch (e: any) {
        set({ error: e?.message ?? 'login error', successLogin: false })
        throw e
      } finally {
        set({ loading: false })
      }
    },

    logout: async () => {
      await logoutUser()

      // ——— claves que debemos preservar ———
      const REMEMBER_EMAIL_KEY = 'drs.remember.email'
      const REMEMBER_PASS_KEY  = 'drs.remember.password'
      const REMEMBER_FLAG_KEY  = 'drs.remember.flag'

      const rememberFlag = localStorage.getItem(REMEMBER_FLAG_KEY) // "1" | null
      const rememberedEmailLS = localStorage.getItem(REMEMBER_EMAIL_KEY)
      const rememberedPassLS  = localStorage.getItem(REMEMBER_PASS_KEY)

      const firebaseToken = localStorage.getItem('firebaseTokenDoc')
      const deviceId = localStorage.getItem('deviceIdDoc')

      // ——— limpiar sesión ———
      set({ user: null, token: null })
      setInterceptor(null)

      localStorage.clear()

      // ——— restaurar preservados ———
      if (firebaseToken) localStorage.setItem('firebaseTokenDoc', firebaseToken)
      if (deviceId) localStorage.setItem('deviceIdDoc', deviceId)

      if (rememberFlag === '1' && rememberedEmailLS) {
        localStorage.setItem(REMEMBER_FLAG_KEY, '1')
        localStorage.setItem(REMEMBER_EMAIL_KEY, rememberedEmailLS)
        if (rememberedPassLS) localStorage.setItem(REMEMBER_PASS_KEY, rememberedPassLS)
        set({ remeberMe: true, userRemebered: { email: rememberedEmailLS } as any })
      } else {
        localStorage.removeItem(REMEMBER_FLAG_KEY)
        localStorage.removeItem(REMEMBER_EMAIL_KEY)
        localStorage.removeItem(REMEMBER_PASS_KEY)
        set({ remeberMe: false, userRemebered: null })
      }

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

    // Apagar el toggle debe limpiar email y password recordados
    handleRemeberMe: async (rememberme) => {
      set({ remeberMe: rememberme })
      if (!rememberme) {
        try {
          await forgetUser()
          set({ userRemebered: null })
        } catch { /* noop */ }
        try {
          localStorage.removeItem('drs.remember.flag')
          localStorage.removeItem('drs.remember.email')
          localStorage.removeItem('drs.remember.password')
        } catch { /* noop */ }
      }
    },

    handleForgetUser: async () => {
      await forgetUser()
      set({ remeberMe: false, userRemebered: null })
      try {
        localStorage.removeItem('drs.remember.flag')
        localStorage.removeItem('drs.remember.email')
        localStorage.removeItem('drs.remember.password')
      } catch { /* noop */ }
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
    if (rememberedDoc?.user?.email) {
      useAuthStore.setState({ remeberMe: true, userRemebered: rememberedDoc.user })
    }
  } catch {
    // ignore initialization errors
  }
}

initAuthStore()
