import { describe, it, expect, vi } from 'vitest'

import type { RequisitionsState, Set, Get } from '../types'

import { downloadRequistionResume } from './downloadRequistionResume'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => { throw new Error('fail') } }))

describe('downloadRequistionResume util', () => {
  it('maneja errores y apaga downloadingDocument', async () => {
    const state: Partial<RequisitionsState> = { downloadingDocument: false, succesDownloadDocument: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as RequisitionsState) : partial)
    const get: Get = () => state as RequisitionsState

    await downloadRequistionResume('1', set, get)

    expect(state.downloadingDocument).toBe(false)
    expect(state.succesDownloadDocument).toBe(false)
    expect(state.error).toBe('fail')
  })
})
