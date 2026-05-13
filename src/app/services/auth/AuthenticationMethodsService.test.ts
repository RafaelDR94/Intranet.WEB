import { describe, expect, it, vi } from 'vitest'

import { fetchAuthenticationMethods } from './AuthenticationMethodsService'

const getSpy = vi.fn()

vi.mock('@/app/utilities/Http/requireGateway', () => ({
  requireGateway: () => vi.fn(),
}))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pGet: () => getSpy,
}))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({
  normalizeApiError: (error: unknown) => ({ message: String(error) }),
}))

describe('fetchAuthenticationMethods', () => {
  it('preserva passkey cuando viene del backend', async () => {
    getSpy.mockResolvedValueOnce({
      data: {
        data: [
          { type: 'Passkey', value: 'admin@dr.com' },
          { type: 'Email', value: 'ad***@dr.com' },
        ],
      },
    })

    await expect(fetchAuthenticationMethods('admin@dr.com')).resolves.toEqual([
      { type: 'Passkey', value: 'admin@dr.com' },
      { type: 'Email', value: 'ad***@dr.com' },
    ])
    expect(getSpy).toHaveBeenCalledWith(
      '/Auth/AuthenticationMethods?email=admin%40dr.com',
    )
  })
})
