'use client'

import { AuthPasskeys, AuthPasskeysByUser, AuthPasskeysLoginOptions, AuthPasskeysLoginVerify, AuthPasskeysRegisterOptions, AuthPasskeysRegisterVerify } from '@/app/configurations/Axios/urls'
import type { User } from '@/app/context/AuthContext/types'
import { mapUserPasskeysResponse } from '@/app/mappings/users/user.mapper'
import type { UserPasskeyResponse } from '@/app/mappings/users/user.types'
import { useAuthStore } from '@/app/stores/useAuthStore/useAuthStore'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pDelete, pGet, pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { parseCreationOptions, parseRequestOptions, serializeCredential } from './base64url'

export type UserPasskey = UserPasskeyResponse

type OptionsEnvelope = {
  challengeId?: string
  username?: string
  options?: Record<string, unknown>
  publicKey?: Record<string, unknown>
  credentialCreationOptions?: Record<string, unknown>
  credentialRequestOptions?: Record<string, unknown>
}

const normalizePasskeyError = (error: unknown): string => {
  const message = normalizeApiError(error).message

  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError') return 'Se canceló la autenticación o se agotó el tiempo.'
    if (error.name === 'SecurityError') return 'El dominio actual no está autorizado para usar passkeys.'
    if (error.name === 'InvalidStateError') return 'No encontramos una passkey registrada para esta cuenta.'
    if (error.name === 'TimeoutError') return 'La solicitud expiró. Intenta nuevamente.'
  }

  if (/not supported|webauthn/i.test(message)) return 'Este dispositivo no soporta passkeys.'

  return message
}

const toOptionalString = (value: unknown): string | undefined => {
  if (value == null) return undefined
  const normalized = String(value).trim()
  return normalized.length > 0 ? normalized : undefined
}

export const isPasskeySupported = async () => {
  if (typeof window === 'undefined') return false

  return Boolean(
    window.PublicKeyCredential &&
      navigator.credentials &&
      typeof navigator.credentials.create === 'function' &&
      typeof navigator.credentials.get === 'function',
  )
}

export const PasskeyService = {
  async registerPasskey(deviceName: string): Promise<void> {
    if (!(await isPasskeySupported())) {
      throw new Error('Este dispositivo no soporta passkeys.')
    }

    try {
      const post = pPost(requireGateway('post'))
      const query = `?deviceName=${encodeURIComponent(deviceName)}`
      const optionsResponse = await post(`${AuthPasskeysRegisterOptions}${query}`, {})
      const rawBody = optionsResponse?.data?.data ?? optionsResponse?.data ?? {}
      const envelope = rawBody as OptionsEnvelope
      const challengeId = String(envelope.challengeId ?? '').trim()
      const rawOptions =
        envelope.options ??
        envelope.publicKey ??
        envelope.credentialCreationOptions ??
        rawBody
      const creationOptions = parseCreationOptions(rawOptions)
      if (
        !Array.isArray(creationOptions.pubKeyCredParams) ||
        creationOptions.pubKeyCredParams.length === 0
      ) {
        throw new Error('La respuesta de RegisterOptions no incluye pubKeyCredParams.')
      }

      const credential = await navigator.credentials.create({ publicKey: creationOptions })
      if (!credential) throw new Error('Se canceló la autenticación o se agotó el tiempo.')

      await post(AuthPasskeysRegisterVerify, {
        challengeId,
        deviceName,
        credential: serializeCredential(credential as PublicKeyCredential),
      })
    } catch (error) {
      throw new Error(normalizePasskeyError(error))
    }
  },

  async loginWithPasskey(email: string): Promise<User> {
    if (!(await isPasskeySupported())) {
      throw new Error('Este dispositivo no soporta passkeys.')
    }

    try {
      const post = pPost(requireGateway('post'))
      const query = `?email=${encodeURIComponent(email)}`
      const optionsResponse = await post(`${AuthPasskeysLoginOptions}${query}`, { email })
      const rawBody = optionsResponse?.data?.data ?? optionsResponse?.data ?? {}
      const envelope = rawBody as OptionsEnvelope
      const challengeId = String(envelope.challengeId ?? '').trim()
      const rawOptions =
        envelope.options ??
        envelope.publicKey ??
        envelope.credentialRequestOptions ??
        rawBody
      const requestOptions = parseRequestOptions(rawOptions)
      const username =
        toOptionalString(envelope.username) ??
        toOptionalString((rawBody as Record<string, unknown>)?.username) ??
        toOptionalString((rawBody as Record<string, unknown>)?.userName) ??
        toOptionalString((rawOptions as Record<string, unknown>)?.username) ??
        email

      const credential = await navigator.credentials.get({ publicKey: requestOptions })
      if (!credential) throw new Error('Se canceló la autenticación o se agotó el tiempo.')
      const serializedCredential = serializeCredential(credential as PublicKeyCredential)

      const verifyResponse = await post(AuthPasskeysLoginVerify, {
        challengeId,
        email,
        username,
        credential: serializedCredential,
      })

      const payload = verifyResponse?.data?.data ?? verifyResponse?.data
      return payload as User
    } catch (error) {
      throw new Error(normalizePasskeyError(error))
    }
  },

  async getPasskeys(): Promise<UserPasskey[]> {
    const userId = useAuthStore.getState().user?.idUser
    if (!userId) return []

    try {
      const get = pGet(requireGateway('get'))
      const response = await get(`${AuthPasskeysByUser}/${encodeURIComponent(userId)}`)
      return mapUserPasskeysResponse(response.data)
    } catch (error) {
      throw new Error(normalizePasskeyError(error))
    }
  },

  async deletePasskey(id: string): Promise<void> {
    try {
      const del = pDelete(requireGateway('del'))
      await del(`${AuthPasskeys}/${encodeURIComponent(id)}`)
    } catch (error) {
      throw new Error(normalizePasskeyError(error))
    }
  },
}
