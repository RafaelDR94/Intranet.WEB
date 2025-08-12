import { describe, expect, it } from 'vitest'
import type { AxiosResponse } from 'axios'
import { normalizeApiError } from './normalizeApiError'

const mockRes = (status: number, data: any = {}, statusText?: string): AxiosResponse => ({
  status,
  data,
  statusText,
} as AxiosResponse)

describe('normalizeApiError', () => {
  it('normalizes AxiosResponse', () => {
    const res = mockRes(404, { error_Message: 'Not found', error_Code: 'NF' })
    expect(normalizeApiError(res)).toEqual({
      message: 'Not found',
      status: 404,
      code: 'NF',
      details: res.data,
    })
  })

  it('handles Error instance', () => {
    const err = new Error('boom')
    expect(normalizeApiError(err)).toEqual({ message: 'boom' })
  })

  it('handles string errors', () => {
    expect(normalizeApiError('fail')).toEqual({ message: 'fail' })
  })

  it('handles plain object errors', () => {
    expect(normalizeApiError({ message: 'oops' })).toEqual({ message: 'oops' })
  })

  it('returns fallback for unknown structures', () => {
    expect(normalizeApiError(123, 'fallback')).toEqual({ message: 'fallback' })
  })
})
