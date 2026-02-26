import { render } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import AuthorizationList from './AuthorizationList'
import useAuthorizationList from './hooks/useAuthorizationList'

vi.mock('./hooks/useAuthorizationList', () => ({
  __esModule: true,
  default: vi.fn(),
}))

const dataTableSpy = vi.fn()
vi.mock('@/app/components/DataTable/DataTable', () => ({
  __esModule: true,
  DataTable: (props: any) => {
    dataTableSpy(props)
    return <div data-testid="data-table" />
  },
}))

describe('AuthorizationList', () => {
  const mockHook = useAuthorizationList as unknown as Mock

  beforeEach(() => {
    dataTableSpy.mockClear()
    mockHook.mockReset()
    mockHook.mockReturnValue({
      columns: [],
      rows: [],
      filterOptions: [],
      filterValue: 'all',
      handleFilterChange: vi.fn(),
      handleRefresh: vi.fn(),
    })
  })

  it('renderiza la tabla con las props del hook', () => {
    render(<AuthorizationList />)
    expect(dataTableSpy).toHaveBeenCalledTimes(1)
    const props = dataTableSpy.mock.calls[0][0]
    expect(props.filterValue).toBe('all')
    expect(props.tables[0].data).toEqual([])
  })
})
