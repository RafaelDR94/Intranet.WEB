import { renderHook, act } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import useDataTable from './useDataTable'

type Row = { id: string; created_at?: string }

const table = (data: Row[]) => ({ data })

describe('useDataTable date filtering', () => {
  it('keeps only rows in the inclusive range and excludes rows without a valid date', () => {
    const { result } = renderHook(() =>
      useDataTable<Row>({ dateKey: 'created_at' }),
    )

    act(() => {
      result.current.handleDateChange(
        new Date(2026, 6, 10),
        new Date(2026, 6, 10),
      )
    })

    expect(
      result.current.getFilteredData(
        table([
          { id: 'at-start', created_at: '2026-07-10T00:00:00' },
          { id: 'at-end', created_at: '2026-07-10T23:59:59' },
          { id: 'outside', created_at: '2026-07-11T00:00:00' },
          { id: 'without-date' },
          { id: 'invalid-date', created_at: 'not-a-date' },
        ]),
      ).map((row) => row.id),
    ).toEqual(['at-start', 'at-end'])
  })
})
