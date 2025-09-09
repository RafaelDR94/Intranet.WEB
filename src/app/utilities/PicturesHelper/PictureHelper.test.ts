import { describe,it,expect } from 'vitest'

import { base64ToBlob,getBase64FileSizeInKB } from './PictureHelper'

describe('PictureHelper',()=>{
  it('converts base64 to blob',()=>{
    const data='data:image/png;base64,aGVsbG8='
    const blob=base64ToBlob(data)
    expect(blob.type).toBe('image/png')
  })
  it('calculates size',()=>{
    const data='data:image/png;base64,aGVsbG8='
    expect(getBase64FileSizeInKB(data)).toBeGreaterThan(0)
  })
})
