
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import IntranetGatewayInit from './IntranetGatewatInit'

// Mock del hook que provee las funciones CRUD
vi.mock('@/app/hooks/useIntranetCRUD/useIntranetCRUD', () => ({
  default: () => ({
    IntranetGet: vi.fn(),
    IntranetPost: vi.fn(),
    IntranetPut: vi.fn(),
    IntranetDelete: vi.fn(),
  }),
}))

// Mock del store de Zustand
const setCRUDMock = vi.fn()
vi.mock('@/app/stores/system/useIntranetGatewayStore', () => ({
  useIntranetGatewayStore: (selector: any) =>
    selector({
      setCRUD: setCRUDMock,
    }),
}))

describe('IntranetGatewayInit', () => {
  beforeEach(() => {
    setCRUDMock.mockClear()
  })

  it('registra CRUD en el store al montar', () => {
    render(<IntranetGatewayInit />)
    expect(setCRUDMock).toHaveBeenCalledTimes(1)
    const arg = setCRUDMock.mock.calls[0][0]
    expect(arg).toHaveProperty('get')
    expect(arg).toHaveProperty('post')
    expect(arg).toHaveProperty('put')
    expect(arg).toHaveProperty('del')
  })
})