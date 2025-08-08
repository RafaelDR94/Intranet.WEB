'use client'
import { useEffect } from 'react'
import type { ServiceWorkerRegisterProps } from './types'

export const ServiceWorkerRegister: React.FC<ServiceWorkerRegisterProps> = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[SW] Registrado:', registration)

          registration.addEventListener('updatefound', () => {
            alert('🔍 Nueva versión detectada.')
            const newWorker = registration.installing
            if (!newWorker) return

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated') {
                alert('✅ App actualizada a la última versión.')
              }
            })
          })
        })
        .catch((error) => console.error('[SW] Error al registrar:', error))
    }
  }, [])

  return null
}

export default ServiceWorkerRegister
