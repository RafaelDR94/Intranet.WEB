'use client'

/** Convierte una cadena base64url a ArrayBuffer. */
export const base64UrlToBuffer = (value: string): ArrayBuffer => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)

  if (typeof Buffer !== 'undefined') {
    const bytes = Buffer.from(padded, 'base64')
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
  }

  const binary = atob(padded)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i)
  return out.buffer
}

const bytesToBase64 = (bytes: Uint8Array): string => {
  if (typeof Buffer !== 'undefined') return Buffer.from(bytes).toString('base64')

  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

/** Convierte un ArrayBuffer a base64url. */
export const bufferToBase64Url = (buffer: ArrayBuffer): string => {
  const base64 = bytesToBase64(new Uint8Array(buffer))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

/** Normaliza opciones de registro de WebAuthn provenientes del backend. */
export const parseCreationOptions = (
  options: Record<string, unknown>,
): PublicKeyCredentialCreationOptions => {
  const rawUser = (options.user as Record<string, unknown>) ?? {}
  const rawExcludeCredentials = Array.isArray(options.excludeCredentials)
    ? options.excludeCredentials
    : []

  return {
    ...options,
    challenge: base64UrlToBuffer(String(options.challenge ?? '')),
    user: {
      ...rawUser,
      id: base64UrlToBuffer(String(rawUser.id ?? '')),
    } as PublicKeyCredentialUserEntity,
    excludeCredentials: rawExcludeCredentials.map((item) => {
      const credential = item as Record<string, unknown>
      return {
        ...credential,
        id: base64UrlToBuffer(String(credential.id ?? '')),
      }
    }) as PublicKeyCredentialDescriptor[],
  } as PublicKeyCredentialCreationOptions
}

/** Normaliza opciones de autenticación de WebAuthn provenientes del backend. */
export const parseRequestOptions = (
  options: Record<string, unknown>,
): PublicKeyCredentialRequestOptions => {
  const rawAllowCredentials = Array.isArray(options.allowCredentials)
    ? options.allowCredentials
    : []

  return {
    ...options,
    challenge: base64UrlToBuffer(String(options.challenge ?? '')),
    allowCredentials: rawAllowCredentials.map((item) => {
      const credential = item as Record<string, unknown>
      return {
        ...credential,
        id: base64UrlToBuffer(String(credential.id ?? '')),
      }
    }) as PublicKeyCredentialDescriptor[],
  } as PublicKeyCredentialRequestOptions
}

/** Serializa una credencial WebAuthn para enviarla al backend. */
export const serializeCredential = (credential: PublicKeyCredential) => {
  const response = credential.response

  if (response instanceof AuthenticatorAttestationResponse) {
    return {
      id: credential.id,
      rawId: bufferToBase64Url(credential.rawId),
      type: credential.type,
      response: {
        clientDataJSON: bufferToBase64Url(response.clientDataJSON),
        attestationObject: bufferToBase64Url(response.attestationObject),
        transports: typeof response.getTransports === 'function' ? response.getTransports() : undefined,
      },
      clientExtensionResults: credential.getClientExtensionResults(),
      authenticatorAttachment: credential.authenticatorAttachment ?? undefined,
    }
  }

  const assertion = response as AuthenticatorAssertionResponse
  return {
    id: credential.id,
    rawId: bufferToBase64Url(credential.rawId),
    type: credential.type,
    response: {
      clientDataJSON: bufferToBase64Url(assertion.clientDataJSON),
      authenticatorData: bufferToBase64Url(assertion.authenticatorData),
      signature: bufferToBase64Url(assertion.signature),
      userHandle: assertion.userHandle ? bufferToBase64Url(assertion.userHandle) : null,
    },
    clientExtensionResults: credential.getClientExtensionResults(),
    authenticatorAttachment: credential.authenticatorAttachment ?? undefined,
  }
}
