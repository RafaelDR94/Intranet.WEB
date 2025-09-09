import type { AxiosResponse } from 'axios'
import { describe, expect, it } from 'vitest'

import { pGet, pPost, pPut, pDelete } from './promisifyIntranet'

const okRes = { status: 200, data: {} } as AxiosResponse
const errRes = { status: 500, data: {}, statusText: '' } as AxiosResponse

describe('promisifyIntranet', () => {
  it('pGet resolves on success', async () => {
    const getFn = (url: string, cb: (res: AxiosResponse) => void) => cb(okRes)
    await expect(pGet(getFn)('/')).resolves.toBe(okRes)
  })

  it('pGet rejects on error status', async () => {
    const getFn = (url: string, cb: (res: AxiosResponse) => void) => cb(errRes)
    await expect(pGet(getFn)('/')).rejects.toMatchObject({ status: 500 })
  })

  it('pPost resolves on success', async () => {
    const postFn = (url: string, data: any, cb: (res: AxiosResponse) => void) => cb(okRes)
    await expect(pPost(postFn)('/', {})).resolves.toBe(okRes)
  })

  it('pPut resolves on success', async () => {
    const putFn = (url: string, data: any, cb: (res: AxiosResponse) => void) => cb(okRes)
    await expect(pPut(putFn)('/', {})).resolves.toBe(okRes)
  })

  it('pDelete resolves on success', async () => {
    const delFn = (url: string, cb: (res: AxiosResponse) => void) => cb(okRes)
    await expect(pDelete(delFn)('/')).resolves.toBe(okRes)
  })
})
