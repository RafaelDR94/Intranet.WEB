'use client'

import type { AxiosResponse } from 'axios'

import { Documents as DocumentsUrl } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pDelete } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import type { Get, Set } from '../types'

export const deleteDocument = async (
  set: Set,
  _get: Get,
  id: string,
): Promise<boolean> => {
  if (!id) return false

  set({ deletingDocument: true, error: undefined, successDeleteDocument: false })

  try {
    const del = pDelete(requireGateway('del'), [200, 204])
    const url = `${DocumentsUrl}?id=${encodeURIComponent(id)}`
    const _response: AxiosResponse = await del(url)

    set((state) => ({
      documents: state.documents.filter((doc) => doc.document_id !== id),
      managementDocuments: state.managementDocuments.filter(
        (doc) => doc.document_id !== id,
      ),
      deletingDocument: false,
      successDeleteDocument: true,
    }))

    return true
  } catch (error) {
    const normalized = normalizeApiError(error)
    set({
      deletingDocument: false,
      successDeleteDocument: false,
      error: normalized.message,
    })
    return false
  }
}
