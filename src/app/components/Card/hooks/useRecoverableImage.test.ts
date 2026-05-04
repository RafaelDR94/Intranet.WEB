import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const resolveImageWithFallbackMock = vi.fn()

vi.mock('@/app/utilities/PicturesHelper/recoverRemoteImage', () => ({
  isRemoteImageCandidate: (src: string) => /^https?:\/\//i.test(src.trim()),
  resolveImageWithFallback: (...args: unknown[]) => resolveImageWithFallbackMock(...args),
  clearRecoveredImageCache: vi.fn(),
}))

import { useRecoverableImage } from './useRecoverableImage'

describe('useRecoverableImage', () => {
  beforeEach(() => {
    resolveImageWithFallbackMock.mockReset()
    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      configurable: true,
      value: vi.fn(() => 'blob:generated'),
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      writable: true,
      configurable: true,
      value: vi.fn(),
    })
    vi.spyOn(URL, 'createObjectURL').mockImplementation(() => 'blob:generated')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('keeps direct render for browser-friendly urls on initial render', () => {
    const { result } = renderHook(() =>
      useRecoverableImage({
        imageSrc: 'https://cdn.example.com/evidence.jpg',
      })
    )

    expect(result.current.currentSrc).toBe('https://cdn.example.com/evidence.jpg')
    expect(result.current.hasPlaceholder).toBe(false)
    expect(result.current.isLoading).toBe(true)
  })

  it('recovers the image as blob after the first remote load error', async () => {
    resolveImageWithFallbackMock.mockResolvedValue({
      blob: new Blob(['ok'], { type: 'image/webp' }),
      contentType: 'image/webp',
    })

    const { result } = renderHook(() =>
      useRecoverableImage({
        imageSrc: 'https://cdn.example.com/image-without-extension',
      })
    )

    await act(async () => {
      await result.current.handleImageError()
    })

    expect(resolveImageWithFallbackMock).toHaveBeenCalledWith(
      'https://cdn.example.com/image-without-extension'
    )
    expect(result.current.currentSrc).toBe('blob:generated')
    expect(result.current.hasPlaceholder).toBe(false)
  })

  it('prefetches recovery immediately for remote urls without extension', async () => {
    resolveImageWithFallbackMock.mockResolvedValue({
      blob: new Blob(['ok'], { type: 'image/jpeg' }),
      contentType: 'image/jpeg',
    })

    const { result } = renderHook(() =>
      useRecoverableImage({
        imageSrc: 'https://cdn.example.com/image-without-extension',
      })
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(resolveImageWithFallbackMock).toHaveBeenCalledWith(
      'https://cdn.example.com/image-without-extension'
    )
    expect(result.current.currentSrc).toBe('blob:generated')
    expect(result.current.isLoading).toBe(false)
  })

  it('shows placeholder when recovery fails and there is no fallback src', async () => {
    resolveImageWithFallbackMock.mockRejectedValue(new Error('bad mime'))

    const { result } = renderHook(() =>
      useRecoverableImage({
        imageSrc: 'https://cdn.example.com/image-without-extension',
      })
    )

    await waitFor(() => {
      expect(result.current.currentSrc).toBe('https://cdn.example.com/image-without-extension')
      expect(result.current.isLoading).toBe(true)
    })

    await act(async () => {
      await result.current.handleImageError()
    })

    await waitFor(() => {
      expect(result.current.currentSrc).toBe('')
      expect(result.current.hasPlaceholder).toBe(true)
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('falls back to the explicit fallback src when recovery fails', async () => {
    resolveImageWithFallbackMock.mockRejectedValue(new Error('bad mime'))

    const { result } = renderHook(() =>
      useRecoverableImage({
        imageSrc: 'https://cdn.example.com/image-without-extension',
        fallbackSrc: '/images/fallback.png',
      })
    )

    await act(async () => {
      await Promise.resolve()
      await result.current.handleImageError()
    })

    expect(result.current.currentSrc).toBe('/images/fallback.png')
    expect(result.current.hasPlaceholder).toBe(false)
  })

  it('revokes the previous object url when the source changes and on unmount', async () => {
    resolveImageWithFallbackMock.mockResolvedValue({
      blob: new Blob(['ok'], { type: 'image/png' }),
      contentType: 'image/png',
    })

    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL')

    const { result, rerender, unmount } = renderHook(
      ({ imageSrc }: { imageSrc: string }) =>
        useRecoverableImage({
          imageSrc,
        }),
      {
        initialProps: {
          imageSrc: 'https://cdn.example.com/first-image',
        },
      }
    )

    await act(async () => {
      await Promise.resolve()
    })

    rerender({ imageSrc: 'https://cdn.example.com/second-image' })
    expect(revokeSpy).toHaveBeenCalledWith('blob:generated')

    unmount()
    expect(revokeSpy).toHaveBeenCalledTimes(1)
  })

  it('does not retry remote recovery indefinitely after the first failure', async () => {
    resolveImageWithFallbackMock.mockRejectedValue(new Error('bad mime'))

    const { result } = renderHook(() =>
      useRecoverableImage({
        imageSrc: 'https://cdn.example.com/image-without-extension',
      })
    )

    await act(async () => {
      await Promise.resolve()
      await result.current.handleImageError()
      await result.current.handleImageError()
    })

    expect(resolveImageWithFallbackMock).toHaveBeenCalledTimes(1)
    expect(result.current.hasPlaceholder).toBe(true)
  })

  it('keeps direct render for remote urls that already have a browser-friendly extension', () => {
    const { result } = renderHook(() =>
      useRecoverableImage({
        imageSrc: 'https://cdn.example.com/evidence.jpg',
      })
    )

    expect(result.current.currentSrc).toBe('https://cdn.example.com/evidence.jpg')
    expect(result.current.isLoading).toBe(true)
    expect(resolveImageWithFallbackMock).not.toHaveBeenCalled()
  })
})
