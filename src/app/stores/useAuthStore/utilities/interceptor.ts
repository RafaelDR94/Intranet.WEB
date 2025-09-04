'use client'
import { intranetClient } from '@/app/configurations/Axios/Clients'

let interceptorId: number | null = null

export const setInterceptor = (token: string | null): void => {
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
