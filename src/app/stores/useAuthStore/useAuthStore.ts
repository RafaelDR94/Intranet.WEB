'use client'
import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { AuthState } from './types'
import {
  authValidate,
  changePassword,
  recoverPassword,
  fetchRecoverChannels,
  fetchFirebaseConfiguration,
  changeNipStatusByIdUser,
  changeMfaStatus,
  changeMfaMethodStatus,
  fetchUserMfaById,
  fetchUserPasskeys,
  deleteUserPasskey,
  changeNip,
  createNip,
  login,
  logout,
  verifyOTP,
  verifyPasswordRecoveryCode,
  verifyPasswordRecoverySms,
  verifyAuthChallenge,
  resetPasswordRecovery,
  askforOTPemail,
  validLoggin,
  updateUser,
  handleRemeberMe,
  handleForgetUser,
  handleOfflineMode,
  setInterceptor,
  updateUserPermissions,
  changeSignature
} from './utilities'

import type { User } from '@/app/context/AuthContext/types'
import { readUser, readUserRemebered, saveLastUserRemebered, saveUser } from '@/app/context/AuthContext/utilities/AuthService'
import { fetchUserSignature } from './utilities/fetchUserSignature'

/**
 * Store para operaciones de autenticación.
 */
export const useAuthStore = createWithEqualityFn<AuthState>()(
  devtools((set, get) => ({
    signature: "",
    loginData: undefined,
    firebaseConfig: undefined,
    user: null,
    userRemebered: null,
    token: null,
    hasExpired: false,
    hydrated: false,
    remeberMe: false,
    offlineMode: false,
    loading: false,
    changingSignature: false,
    changingMFA: false,
    changingMFAMethod: false,
    recoveringPassword: false,
    verifyingPasswordRecovery: false,
    resettingPasswordRecovery: false,
    verifyingAuthChallenge: false,
    fetchingRecoverChannels: false,
    fetchingUserMfaById: false,
    fetchingUserPasskeys: false,
    deletingUserPasskey: false,
    recoverChannels: [],
    userMfaById: null,
    userPasskeys: [],
    mfaSmsEnabled: false,
    mfaEmailEnabled: false,
    recoverPasswordRequest: undefined,
    recoverPasswordChallenge: undefined,
    passwordRecoveryVerification: undefined,
    passwordRecoveryResetResponse: undefined,
    authChallengeVerification: undefined,
    successLogin: false,
    successAuthValidate: false,
    successChangePassword: false,
    successRecoverPassword: false,
    successPasswordRecoveryVerification: false,
    successResetPasswordRecovery: false,
    successAuthChallengeVerification: false,
    successRecoverChannels: false,
    successChangeNIPStatus: false,
    succesChangeSignature: false,
    successChangeNIP: false,
    successCreateNIP: false,
    successFirebaseConfig: false,
    successChangeMFA: false,
    successChangeMFAMethod: false,
    successUserMfaById: false,
    successUserPasskeys: false,
    successDeleteUserPasskey: false,
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
    authValidate: (payload) => authValidate(set, payload),
    changePassword: (payload) => changePassword(set, get, payload),
    recoverPassword: (payload) => recoverPassword(set, get, payload),
    fetchRecoverChannels: (email) => fetchRecoverChannels(set, email),
    verifyPasswordRecoveryCode: (payload) =>
      verifyPasswordRecoveryCode(set, get, payload),
    verifyPasswordRecoverySms: (payload) =>
      verifyPasswordRecoverySms(set, get, payload),
    verifyAuthChallenge: (payload) => verifyAuthChallenge(set, get, payload),
    resetPasswordRecovery: (payload) =>
      resetPasswordRecovery(set, get, payload),
    fetchFirebaseConfiguration: () => fetchFirebaseConfiguration(set),
    fetchUserMfaById: (idUser) => fetchUserMfaById(set, idUser),
    fetchUserPasskeys: (idUser) => fetchUserPasskeys(set, idUser),
    changeNipStatusByIdUser: (id) => changeNipStatusByIdUser(id, set),
    changeMfaStatus: (payload) => changeMfaStatus(set, get, payload),
    changeMfaMethodStatus: (payload) =>
      changeMfaMethodStatus(set, get, payload),
    deleteUserPasskey: (id) => deleteUserPasskey(set, get, id),
    changeNip: (payload) => changeNip(set, get, payload),
    createNip: (payload) => createNip(set, get, payload),
    changeSignature: (payload) => changeSignature(set, get, payload),
    updateUserPermissions: (permissions: string) => updateUserPermissions(set, get, permissions),
    clearRecoverPasswordState: () =>
      set({
        recoverPasswordRequest: undefined,
        recoverPasswordChallenge: undefined,
        passwordRecoveryVerification: undefined,
        passwordRecoveryResetResponse: undefined,
        authChallengeVerification: undefined,
        recoveringPassword: false,
        verifyingPasswordRecovery: false,
        resettingPasswordRecovery: false,
        verifyingAuthChallenge: false,
        fetchingRecoverChannels: false,
        successRecoverPassword: false,
        successPasswordRecoveryVerification: false,
        successResetPasswordRecovery: false,
        successAuthChallengeVerification: false,
        successRecoverChannels: false,
        error: undefined,
      }),
    reset: () =>
      set({
        signature: "",
        loginData: undefined,
        firebaseConfig: undefined,
        user: null,
        userRemebered: null,
        token: null,
        hasExpired: false,
        remeberMe: false,
        offlineMode: false,
        loading: false,
        recoverPasswordRequest: undefined,
        recoverPasswordChallenge: undefined,
        passwordRecoveryVerification: undefined,
        passwordRecoveryResetResponse: undefined,
        authChallengeVerification: undefined,
        recoverChannels: [],
        error: undefined,
        successLogin: false,
        successAuthValidate: false,
        successChangePassword: false,
        successRecoverPassword: false,
        successPasswordRecoveryVerification: false,
        successResetPasswordRecovery: false,
        successAuthChallengeVerification: false,
        successRecoverChannels: false,
        successChangeNIPStatus: false,
        successChangeNIP: false,
        successCreateNIP: false,
        successFirebaseConfig: false,
        successChangeMFA: false,
        successChangeMFAMethod: false,
        successUserMfaById: false,
        successUserPasskeys: false,
        successDeleteUserPasskey: false,
        recoveringPassword: false,
        verifyingPasswordRecovery: false,
        resettingPasswordRecovery: false,
        verifyingAuthChallenge: false,
        fetchingRecoverChannels: false,
        fetchingUserMfaById: false,
        fetchingUserPasskeys: false,
        deletingUserPasskey: false,
        changingSignature: false,
        changingMFA: false,
        changingMFAMethod: false,
        succesChangeSignature: false,
        userMfaById: null,
        userPasskeys: [],
        mfaSmsEnabled: false,
        mfaEmailEnabled: false,
      }),
    resetFlags: () =>
      set({
        loading: false,
        error: undefined,
        recoverPasswordRequest: undefined,
        recoverPasswordChallenge: undefined,
        passwordRecoveryVerification: undefined,
        passwordRecoveryResetResponse: undefined,
        authChallengeVerification: undefined,
        recoverChannels: [],
        successLogin: false,
        successAuthValidate: false,
        successChangePassword: false,
        successRecoverPassword: false,
        successPasswordRecoveryVerification: false,
        successResetPasswordRecovery: false,
        successAuthChallengeVerification: false,
        successRecoverChannels: false,
        successChangeNIPStatus: false,
        successChangeNIP: false,
        successCreateNIP: false,
        successFirebaseConfig: false,
        successChangeMFA: false,
        successChangeMFAMethod: false,
        successUserMfaById: false,
        successUserPasskeys: false,
        successDeleteUserPasskey: false,
        recoveringPassword: false,
        verifyingPasswordRecovery: false,
        resettingPasswordRecovery: false,
        verifyingAuthChallenge: false,
        fetchingRecoverChannels: false,
        fetchingUserMfaById: false,
        fetchingUserPasskeys: false,
        deletingUserPasskey: false,
        succesChangeSignature: false,
        changingSignature: false,
        changingMFA: false,
        changingMFAMethod: false,
        userMfaById: null,
        userPasskeys: [],
        mfaSmsEnabled: false,
        mfaEmailEnabled: false,

        hasExpired: false,
      }),
    resetSignature: () =>
      set({
        signature: "",
      }),
  }))
)

const isSameAuthUser = (first: User | null | undefined, second: User | null | undefined) => {
  if (!first || !second) {
    return false
  }

  if (first.idEmployee && second.idEmployee && first.idEmployee === second.idEmployee) {
    return true
  }

  if (first.idUser && second.idUser && first.idUser === second.idUser) {
    return true
  }

  return false
}

const initAuthStore = async () => {
  try {
    const [userDocResult, rememberedDocResult] = await Promise.allSettled([
      readUser(),
      readUserRemebered(),
    ])

    const userDoc = userDocResult.status === 'fulfilled' ? userDocResult.value : null
    const rememberedDoc =
      rememberedDocResult.status === 'fulfilled' ? rememberedDocResult.value : null

    let rememberedUser = rememberedDoc?.user ?? null

    if (userDoc?.user) {
      let currentUser = userDoc.user
      let signature = currentUser.signature ?? ''

      useAuthStore.setState({ user: currentUser, token: currentUser.token, signature })
      setInterceptor(currentUser.token)

      const remoteSignature = await fetchUserSignature({
        idEmployee: currentUser.idEmployee,
        idUser: currentUser.idUser,
      })

      if (remoteSignature !== null && remoteSignature !== signature) {
        signature = remoteSignature
        currentUser = { ...currentUser, signature }

        useAuthStore.setState((state) => {
          const shouldUpdateRemembered = isSameAuthUser(state.userRemebered, currentUser)
          return {
            signature,
            user: currentUser,
            userRemebered:
              shouldUpdateRemembered && state.userRemebered
                ? { ...state.userRemebered, signature }
                : state.userRemebered,
          }
        })

        await saveUser(currentUser)

        if (rememberedUser && isSameAuthUser(rememberedUser, currentUser)) {
          rememberedUser = { ...rememberedUser, signature }
          await saveLastUserRemebered(rememberedUser)
        }
      }
    }

    if (rememberedUser?.email) {
      useAuthStore.setState({ remeberMe: true, userRemebered: rememberedUser })
    }
  } catch {
    // ignore initialization errors
  } finally {
    useAuthStore.setState({ hydrated: true })
  }
}

initAuthStore()
