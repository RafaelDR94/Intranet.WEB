// src/app/stores/useRecoverPasswordStore/utilities/recoverPassword.ts
'use client'
import { AuthRecoverPassword } from '@/app/configurations/Axios/urls'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'

/**
 * Solicita la recuperación de contraseña a través del email del usuario.
 * @param email Correo del usuario
 * @returns true si el correo fue enviado exitosamente
 * @throws Error si falla la solicitud
 */
export const recoverPassword = async (email: string): Promise<boolean> => {
  const put = pPut(requireGateway('put'))

  const response = await put(
    `${AuthRecoverPassword}?username=${encodeURIComponent(email)}`,
    {}
  )

  if (response.status === 200) {
    return true
  }

  throw new Error('No se pudo enviar el correo')
}
