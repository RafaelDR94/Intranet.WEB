import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchUserSignature } from './fetchUserSignature'

import { Users } from '@/app/configurations/Axios/urls'

const mockGatewayGet = vi.fn()
const mockPromisify = vi.fn()

vi.mock('@/app/utilities/Http/requireGateway', () => ({
  requireGateway: vi.fn(() => mockGatewayGet),
}))

vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pGet: vi.fn(() => mockPromisify),
}))

const buildResponse = (signature: string | null) => ({
  data: {
    data: signature === null ? { signature: null } : { signature },
  },
})

describe('fetchUserSignature', () => {
  beforeEach(() => {
    mockGatewayGet.mockReset()
    mockPromisify.mockReset()
  })

  it('obtiene la firma usando el id del empleado', async () => {
    mockPromisify.mockResolvedValue(buildResponse('data:image/png;base64,server'))

    const result = await fetchUserSignature({ idEmployee: 'emp-1', idUser: 'usr-1' })

    expect(result).toBe('data:image/png;base64,server')
    expect(mockPromisify).toHaveBeenCalledWith(`${Users}/ById/emp-1`)
  })

  it('usa el id de usuario cuando falla el id del empleado', async () => {
    mockPromisify.mockImplementation((url: string) => {
      if (url.endsWith('emp-1')) {
        return Promise.reject(new Error('not found'))
      }
      return Promise.resolve(buildResponse('data:image/png;base64,alt'))
    })

    const result = await fetchUserSignature({ idEmployee: 'emp-1', idUser: 'usr-1' })

    expect(result).toBe('data:image/png;base64,alt')
    expect(mockPromisify).toHaveBeenCalledTimes(2)
    expect(mockPromisify).toHaveBeenLastCalledWith(`${Users}/ById/usr-1`)
  })

  it('retorna null cuando ninguna consulta tiene éxito', async () => {
    mockPromisify.mockRejectedValue(new Error('network'))

    const result = await fetchUserSignature({ idEmployee: 'emp-1', idUser: 'usr-1' })

    expect(result).toBeNull()
    expect(mockPromisify).toHaveBeenCalledTimes(2)
  })
})
