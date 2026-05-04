export type RecoveredRemoteImage = {
  blob: Blob
  contentType: string
}

import { normalizeImageBlobForBrowser } from './PictureHelper'

const IMAGE_PROTOCOL = /^https?:\/\//i
const recoveredImageCache = new Map<string, Promise<RecoveredRemoteImage>>()

export const isRemoteImageCandidate = (src: string) => IMAGE_PROTOCOL.test(src.trim())

const fetchAndNormalizeRemoteImage = async (src: string): Promise<RecoveredRemoteImage> => {
  const response = await fetch(src)

  if (!response.ok) {
    throw new Error(`Image request failed with status ${response.status}`)
  }

  const contentType = (response.headers.get('content-type') ?? '')
    .split(';')[0]
    .trim()
    .toLowerCase()

  if (!contentType.startsWith('image/')) {
    throw new Error(`Unsupported image content-type: ${contentType || 'unknown'}`)
  }

  const blob = await response.blob()
  const normalizedBlob = await normalizeImageBlobForBrowser(blob, contentType)
  const resolvedContentType = normalizedBlob.type || contentType

  return {
    blob: normalizedBlob,
    contentType: resolvedContentType,
  }
}

export const resolveImageWithFallback = async (
  src: string
): Promise<RecoveredRemoteImage> => {
  const cached = recoveredImageCache.get(src)
  if (cached) return cached

  const request = fetchAndNormalizeRemoteImage(src).catch((error) => {
    recoveredImageCache.delete(src)
    throw error
  })

  recoveredImageCache.set(src, request)
  return request
}

export const clearRecoveredImageCache = () => {
  recoveredImageCache.clear()
}
