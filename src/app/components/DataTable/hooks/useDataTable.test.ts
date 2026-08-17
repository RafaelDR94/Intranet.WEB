import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import useDataTable from './useDataTable'
import type { Table } from './types'

type Row = {
  id: string
  created_at?: string
  nombre?: string
  apellido?: string
  employee?: { fullName?: string }
  status?: string
  date_created?: string
}

const table = (data: Row[], extra?: Omit<Table<Row>, 'data'>): Table<Row> => ({
  data,
  ...extra,
})

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

  it('searches by full names assembled from separate row columns', () => {
    const { result } = renderHook(() => useDataTable<Row>({}))

    act(() => {
      result.current.handleSearchChange('ana garcia')
    })

    expect(
      result.current.getFilteredData(
        table([
          { id: 'match', nombre: 'Ana', apellido: 'Garcia' },
          { id: 'miss', nombre: 'Ana', apellido: 'Lopez' },
        ]),
      ).map((row) => row.id),
    ).toEqual(['match'])
  })

  it('searches visible columns, nested values and rendered cell text', () => {
    const { result } = renderHook(() => useDataTable<Row>({}))

    act(() => {
      result.current.handleSearchChange('aprobado')
    })

    expect(
      result.current.getFilteredData(
        table(
          [
            { id: 'first', nombre: 'Primer registro' },
            {
              id: 'rendered',
              employee: { fullName: 'Luis Perez' },
              status: 'approved',
            },
          ],
          {
            columns: [
              { key: 'nombre', label: 'Nombre' },
              {
                key: 'status',
                label: 'Estatus',
                render: (row) =>
                  React.createElement('span', null, row.status === 'approved' ? 'Aprobado' : ''),
              },
            ],
          },
        ),
      ).map((row) => row.id),
    ).toEqual(['rendered'])
  })

  it('detects date columns when dateKey is not provided', () => {
    const { result } = renderHook(() => useDataTable<Row>({}))

    act(() => {
      result.current.handleDateChange(
        new Date(2026, 7, 15),
        new Date(2026, 7, 15),
      )
    })

    expect(
      result.current.getFilteredData(
        table(
          [
            { id: 'match', date_created: '2026-08-15T12:00:00' },
            { id: 'miss', date_created: '2026-08-16T12:00:00' },
          ],
          {
            columns: [{ key: 'date_created', label: 'Fecha' }],
          },
        ),
      ).map((row) => row.id),
    ).toEqual(['match'])
  })

  it('keeps ISO midnight UTC rows in the same calendar day for table filters', () => {
    const { result } = renderHook(() =>
      useDataTable<Row>({ dateKey: 'date_created' }),
    )

    act(() => {
      result.current.handleDateChange(
        new Date(2026, 7, 17),
        new Date(2026, 7, 17),
      )
    })

    expect(
      result.current.getFilteredData(
        table([
          { id: 'today', date_created: '2026-08-17T00:00:00Z' },
          { id: 'tomorrow', date_created: '2026-08-18T00:00:00Z' },
        ]),
      ).map((row) => row.id),
    ).toEqual(['today'])
  })
})
