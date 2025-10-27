'use client'

import type { AxiosResponse } from 'axios'

import { DocumentType as DocumentTypeUrl } from '@/app/configurations/Axios/urls'
import { mapDocumentTypes } from '@/app/mappings/documents/documents.mapper'
import type { DocumentTypeSummary } from '@/app/mappings/documents/documents.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import type { Get, Set } from '../types'

const toArray = (payload: unknown): unknown[] => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  return [payload]
}

export const fetchDocumentTypes = async (
  set: Set,
  get: Get,
  force = false,
): Promise<void> => {
  const state = get()
  if (!force && state.documentTypes.length > 0) return

  set({ loading: true, error: undefined, successGet: false })

  try {
    const getFn = requireGateway('get')
    const getRequest = pGet(getFn)
    const response: AxiosResponse = await getRequest(DocumentTypeUrl)
    const payload = response?.data?.data ?? response?.data ?? []

    const mapped: DocumentTypeSummary[] = mapDocumentTypes(toArray(payload))
    const activeDocumentTypes = mapped.filter((documentType) => documentType.is_active)

    set({
      documentTypes: mapped,
      activeDocumentTypes,
      loading: false,
      successGet: true,
    })
  } catch (error) {
    const normalized = normalizeApiError(error)
    set({ error: normalized.message, loading: false, successGet: false })
  }
}
