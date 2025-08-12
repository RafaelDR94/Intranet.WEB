// src/app/utilities/http/promisifyIntranet.ts
import type { AxiosResponse } from 'axios'
import { normalizeApiError } from './normalizeApiError'
import { IntranetGetType,IntranetDeleteType,IntranetPostType ,IntranetPutType} from '@/app/hooks/useIntranetCRUD/types'
import { StatusRange } from './types'

/** Rango OK por defecto: 200–299 (incluye 204) */
const DEFAULT_OK: StatusRange = [200, 299]

const isOk = (res: AxiosResponse, [min, max]: StatusRange) =>
  res.status >= min && res.status <= max

export const pGet = (fn: IntranetGetType, ok: StatusRange = DEFAULT_OK) =>
  (url: string): Promise<AxiosResponse> =>
    new Promise((resolve, reject) => {
      try {
        fn(url, (res: AxiosResponse) => {
          if (isOk(res, ok)) return resolve(res)
          return reject(normalizeApiError(res))
        })
      } catch (e) {
        return reject(normalizeApiError(e))
      }
    })

export const pDelete = (fn: IntranetDeleteType, ok: StatusRange = DEFAULT_OK) =>
  (url: string): Promise<AxiosResponse> =>
    new Promise((resolve, reject) => {
      try {
        fn(url, (res: AxiosResponse) => {
          if (isOk(res, ok)) return resolve(res)
          return reject(normalizeApiError(res))
        })
      } catch (e) {
        return reject(normalizeApiError(e))
      }
    })

export const pPost = (fn: IntranetPostType, ok: StatusRange = DEFAULT_OK) =>
  (url: string, data: any): Promise<AxiosResponse> =>
    new Promise((resolve, reject) => {
      try {
        fn(url, data, (res: AxiosResponse) => {
          if (isOk(res, ok)) return resolve(res)
          return reject(normalizeApiError(res))
        })
      } catch (e) {
        return reject(normalizeApiError(e))
      }
    })

export const pPut = (fn: IntranetPutType, ok: StatusRange = DEFAULT_OK) =>
  (url: string, data: any): Promise<AxiosResponse> =>
    new Promise((resolve, reject) => {
      try {
        fn(url, data, (res: AxiosResponse) => {
          if (isOk(res, ok)) return resolve(res)
          return reject(normalizeApiError(res))
        })
      } catch (e) {
        return reject(normalizeApiError(e))
      }
    })
