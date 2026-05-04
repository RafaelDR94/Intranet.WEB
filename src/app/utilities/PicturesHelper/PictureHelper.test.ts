import { beforeEach, describe, expect, it, vi } from 'vitest'

const heic2anyMock = vi.fn()

vi.mock('heic2any', () => ({
  default: (...args: unknown[]) => heic2anyMock(...args),
}))

import {
  base64ToBlob,
  detectImageMimeTypeFromSignature,
  getBase64FileSizeInKB,
  normalizeImageBlobForBrowser,
} from './PictureHelper'

describe('PictureHelper',()=>{
  beforeEach(() => {
    heic2anyMock.mockReset()
  })

  it('converts base64 to blob',()=>{
    const data='data:image/png;base64,aGVsbG8='
    const blob=base64ToBlob(data)
    expect(blob.type).toBe('image/png')
  })
  it('calculates size',()=>{
    const data='data:image/png;base64,aGVsbG8='
    expect(getBase64FileSizeInKB(data)).toBeGreaterThan(0)
  })
  it('detects heic by binary signature', async () => {
    const bytes = new Uint8Array([
      0x00, 0x00, 0x00, 0x1c,
      0x66, 0x74, 0x79, 0x70,
      0x68, 0x65, 0x69, 0x63,
      0x00, 0x00, 0x00, 0x00,
    ])
    const blob = new Blob([bytes], { type: '' })

    await expect(detectImageMimeTypeFromSignature(blob)).resolves.toBe('image/heic')
  })
  it('converts heic blobs to jpeg for browser rendering', async () => {
    heic2anyMock.mockResolvedValue(new Blob(['jpeg'], { type: 'image/jpeg' }))
    const bytes = new Uint8Array([
      0x00, 0x00, 0x00, 0x1c,
      0x66, 0x74, 0x79, 0x70,
      0x68, 0x65, 0x69, 0x63,
      0x00, 0x00, 0x00, 0x00,
    ])
    const blob = new Blob([bytes], { type: 'image/heic' })

    const normalized = await normalizeImageBlobForBrowser(blob)

    expect(heic2anyMock).toHaveBeenCalledTimes(1)
    expect(normalized.type).toBe('image/jpeg')
  })
})
