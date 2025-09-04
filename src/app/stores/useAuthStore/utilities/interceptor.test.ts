import { describe, it, expect, vi } from 'vitest'

const { useSpy, ejectSpy, getHandler } = vi.hoisted(() => {
  let handler: (config: any) => any
  return {
    useSpy: vi.fn().mockImplementation((h) => {
      handler = h
      return 1
    }),
    ejectSpy: vi.fn(),
    getHandler: () => handler,
  }
})

vi.mock('@/app/configurations/Axios/Clients', () => ({
  intranetClient: {
    interceptors: {
      request: {
        use: useSpy,
        eject: ejectSpy,
      },
    },
  },
}))

import { setInterceptor } from './interceptor'

describe('interceptor util', () => {
  it('configura y elimina interceptor', () => {
    setInterceptor('tok')
    const config: any = { headers: {} }
    getHandler()(config)
    expect(config.headers.Authorization).toBe('Bearer tok')
    setInterceptor(null)
    expect(ejectSpy).toHaveBeenCalledWith(1)
  })
})
