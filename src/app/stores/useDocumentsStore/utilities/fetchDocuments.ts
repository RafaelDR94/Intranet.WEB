'use client'

import type { AxiosResponse } from 'axios'

import { Documents as DocumentsUrl, DocumentsByUser as DocumentsByUserUrl } from '@/app/configurations/Axios/urls'
import {
  mapManagementDocuments,
} from '@/app/mappings/documents/documents.mapper'
import type { ManagementDocument } from '@/app/mappings/documents/documents.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import type { Get, Set } from '../types'

const toArray = (payload: unknown): unknown[] => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  return [payload]
}

export const fetchDocuments = async (
  set: Set,
  get: Get,
  force = false,
): Promise<void> => {
  const state = get()
  if (!force && state.documents.length > 0) return

  set({ loading: true, error: undefined, successGet: false })

  try {
    const getFn = requireGateway('get')
    const getRequest = pGet(getFn)
    const response: AxiosResponse = await getRequest(DocumentsUrl)
    const payload = response?.data?.data ?? response?.data ?? []

    const mapped: ManagementDocument[] = mapManagementDocuments(toArray(payload))
    const managementDocuments = mapped.filter((doc) => doc.management)

    set({
      documents: mapped,
      managementDocuments,
      loading: false,
      successGet: true,
    })
  } catch (error) {
    const normalized = normalizeApiError(error)
    set({ error: normalized.message, loading: false, successGet: false })
  }
}

export const fetchDocumentsByUser = async (
  set: Set,
  get: Get,
  idUser: string,
  force = false,
): Promise<void> => {
  const normalizedIdUser = String(idUser ?? '').trim()
  if (!normalizedIdUser) {
    set({ error: 'idUser is required', loading: false, successGet: false })
    return
  }

  const state = get()
  if (!force && state.documents.length > 0) return

  set({ loading: true, error: undefined, successGet: false })

  try {
    const getFn = requireGateway('get')
    const getRequest = pGet(getFn)
    const response: AxiosResponse = await getRequest(
      `${DocumentsByUserUrl}/${encodeURIComponent(normalizedIdUser)}`,
    )
    const payload = response?.data?.data ?? response?.data ?? []

    const mapped: ManagementDocument[] = mapManagementDocuments(toArray(payload))
    const managementDocuments = mapped.filter((doc) => doc.management)

    set({
      documents: mapped,
      managementDocuments,
      loading: false,
      successGet: true,
    })
  } catch (error) {
    const normalized = normalizeApiError(error)
    set({ error: normalized.message, loading: false, successGet: false })
  }
}
