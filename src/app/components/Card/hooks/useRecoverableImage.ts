import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  isRemoteImageCandidate,
  resolveImageWithFallback,
} from '@/app/utilities/PicturesHelper/recoverRemoteImage'

type UseRecoverableImageOptions = {
  imageSrc: string
  fallbackSrc?: string
  enableRemoteImageRecovery?: boolean
}

const trimValue = (value?: string) => (value ?? '').trim()
const loadedImageSrcCache = new Set<string>()

const rememberLoadedImageSrc = (...sources: Array<string | undefined>) => {
  sources
    .map((source) => trimValue(source))
    .filter(Boolean)
    .forEach((source) => loadedImageSrcCache.add(source))
}

const hasLoadedImageSrc = (...sources: Array<string | undefined>) =>
  sources
    .map((source) => trimValue(source))
    .filter(Boolean)
    .some((source) => loadedImageSrcCache.has(source))

const hasRenderableExtension = (src: string) => {
  try {
    const url = new URL(src)
    const pathname = decodeURIComponent(url.pathname).toLowerCase()
    return /\.(jpg|jpeg|png|webp|gif|bmp|svg|avif)$/i.test(pathname)
  } catch {
    return /\.(jpg|jpeg|png|webp|gif|bmp|svg|avif)$/i.test(src.toLowerCase())
  }
}

const shouldPrefetchRemoteRecovery = (src: string) =>
  isRemoteImageCandidate(src) && !hasRenderableExtension(src)

export const clearLoadedImageSrcCache = () => {
  loadedImageSrcCache.clear()
}

export const useRecoverableImage = ({
  imageSrc,
  fallbackSrc,
  enableRemoteImageRecovery = true,
}: UseRecoverableImageOptions) => {
  const primarySrc = useMemo(() => trimValue(imageSrc), [imageSrc])
  const fallback = useMemo(() => trimValue(fallbackSrc), [fallbackSrc])
  const initialSrc = primarySrc || fallback
  const isInitiallyLoaded = hasLoadedImageSrc(initialSrc, primarySrc, fallback)

  const objectUrlRef = useRef<string | null>(null)
  const recoveryAttemptCountRef = useRef(0)
  const requestIdRef = useRef(0)

  const [currentSrc, setCurrentSrc] = useState(initialSrc)
  const [hasPlaceholder, setHasPlaceholder] = useState(!initialSrc)
  const [isLoading, setIsLoading] = useState(Boolean(initialSrc) && !isInitiallyLoaded)

  const revokeObjectUrl = useCallback(() => {
    if (!objectUrlRef.current) return
    URL.revokeObjectURL(objectUrlRef.current)
    objectUrlRef.current = null
  }, [])

  const runRemoteRecovery = useCallback(async (src: string) => {
    recoveryAttemptCountRef.current += 1
    const requestId = ++requestIdRef.current

    try {
      const recovered = await resolveImageWithFallback(src)
      const objectUrl = URL.createObjectURL(recovered.blob)

      if (requestId !== requestIdRef.current) {
        URL.revokeObjectURL(objectUrl)
        return false
      }

      revokeObjectUrl()
      objectUrlRef.current = objectUrl
      setCurrentSrc(objectUrl)
      setHasPlaceholder(false)
      setIsLoading(false)
      return true
    } catch {
      return false
    }
  }, [revokeObjectUrl])

  useEffect(() => {
    requestIdRef.current += 1
    recoveryAttemptCountRef.current = 0
    revokeObjectUrl()
    setCurrentSrc(initialSrc)
    setHasPlaceholder(!initialSrc)

    if (!initialSrc) {
      setIsLoading(false)
      return
    }

    if (
      enableRemoteImageRecovery &&
      primarySrc &&
      shouldPrefetchRemoteRecovery(primarySrc)
    ) {
      setCurrentSrc('')
      setHasPlaceholder(false)
      setIsLoading(true)
      void runRemoteRecovery(primarySrc).then((recovered) => {
        if (recovered) return
        if (fallback) {
          setCurrentSrc(fallback)
          setHasPlaceholder(false)
          setIsLoading(false)
          return
        }
        setCurrentSrc(primarySrc)
        setHasPlaceholder(false)
        setIsLoading(true)
      })
      return
    }

    setIsLoading(!hasLoadedImageSrc(initialSrc, primarySrc, fallback))
  }, [enableRemoteImageRecovery, fallback, initialSrc, primarySrc, revokeObjectUrl, runRemoteRecovery])

  useEffect(() => revokeObjectUrl, [revokeObjectUrl])

  const handleImageError = useCallback(async () => {
    if (
      primarySrc &&
      currentSrc === primarySrc &&
      enableRemoteImageRecovery &&
      recoveryAttemptCountRef.current < 2 &&
      isRemoteImageCandidate(primarySrc)
    ) {
      setIsLoading(true)
      const recovered = await runRemoteRecovery(primarySrc)
      if (recovered) {
        return
      }
    }

    if (fallback && currentSrc !== fallback) {
      revokeObjectUrl()
      setCurrentSrc(fallback)
      setHasPlaceholder(false)
      setIsLoading(false)
      return
    }

    revokeObjectUrl()
    setCurrentSrc('')
    setHasPlaceholder(true)
    setIsLoading(false)
  }, [currentSrc, enableRemoteImageRecovery, fallback, primarySrc, revokeObjectUrl, runRemoteRecovery])

  return {
    currentSrc,
    hasPlaceholder,
    isLoading,
    handleImageError,
    handleImageLoaded: (loadedSrc?: string) => {
      rememberLoadedImageSrc(loadedSrc, currentSrc, primarySrc, fallback)
      setIsLoading(false)
    },
  }
}
