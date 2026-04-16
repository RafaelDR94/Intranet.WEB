'use client'
import { useEffect } from 'react'


export const ServiceWorkerRegister = () => {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    // Evita chunks stale en desarrollo (Next compila on-demand y puede timeout).
    if (process.env.NODE_ENV !== 'production') {
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          void registration.unregister()
        })
      })
      return
    }

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
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
  }, [])

  return null
}

export default ServiceWorkerRegister
