'use client'

import type {
  PasswordRecoveryVerificationResponse,
  RecoverPasswordResponse,
  ResetPasswordRecoveryResponse,
} from '@/app/mappings/auth/auth.types'
import type {
  RecoverPasswordPayload,
  ResetPasswordRecoveryPayload,
  VerifyPasswordRecoveryCodePayload,
  VerifyPasswordRecoverySmsPayload,
} from '../types'

export const isPasswordRecoveryMockEnabled = () =>
  process.env.NEXT_PUBLIC_MOCK_PASSWORD_RECOVERY === 'true'

const maskEmailDestination = (email: string) => {
  const [localPart, domain] = email.split('@')
  if (!domain) return email

  const prefix = localPart.slice(0, Math.min(2, localPart.length))
  return `${prefix}***@${domain}`
}

const maskPhoneDestination = (phone: string) => {
  const digits = phone.replace(/\D/g, '')
  const last4 = (digits.slice(-4) || '5555').padStart(4, '5')
  return `*** *** ${last4}`
}

export const buildMockRecoverPasswordResponse = (
  payload: RecoverPasswordPayload,
): RecoverPasswordResponse => {
  const email = payload.email.trim() || 'usuario@drsecurity.net'
  const isSms = payload.type === 'SMS'

  return {
    type: isSms ? 'SMS' : 'Email',
    challengeId: `mock-${isSms ? 'sms' : 'email'}-challenge`,
    phoneMasked: isSms ? maskPhoneDestination(email) : undefined,
    emailMasked: isSms ? undefined : maskEmailDestination(email),
    message: isSms
      ? 'Enviamos un codigo por SMS al telefono registrado.'
      : 'Enviamos un codigo al correo registrado.',
    expiresInSeconds: 300,
    nextStep: 'VerifyCode',
  }
}

export const buildMockPasswordRecoveryVerificationResponse = (
  payload:
    | VerifyPasswordRecoveryCodePayload
    | VerifyPasswordRecoverySmsPayload,
): PasswordRecoveryVerificationResponse => ({
  message: 'Codigo validado correctamente.',
  challengeId: payload.challengeId,
  nextStep: 'ResetPassword',
})

export const buildMockResetPasswordRecoveryResponse = (
  _payload: ResetPasswordRecoveryPayload,
): ResetPasswordRecoveryResponse => ({
  success: true,
  message: 'Contrasena actualizada correctamente.',
  nextStep: 'Login',
})
