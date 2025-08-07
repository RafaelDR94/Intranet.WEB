import { useMemo, useState } from 'react'

export type SortDirection = 'asc' | 'desc' | null

export interface UseTableContentProps<T> {
  data: T[]
  defaultSortKey?: keyof T
  defaultSortDirection?: SortDirection
}

export const useTableContent = <T extends { id: string | number }>({
  data,
  defaultSortKey,
  defaultSortDirection,
}: UseTableContentProps<T>) => {
  const [selected, setSelected] = useState<(string | number)[]>([])
  const [sortKey, setSortKey] = useState<keyof T | null>(defaultSortKey ?? null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection ?? null)

  const allSelected = data.length > 0 && selected.length === data.length

  const toggleSelect = (id: string | number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    )
  }

  const selectAll = (value: boolean) => {
    setSelected(value ? data.map((f) => f.id) : [])
  }

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      const newDirection = sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc'
      setSortDirection(newDirection)
      if (newDirection === null) setSortKey(null)
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const isDateValue = (val: unknown) =>
    typeof val === 'string' && !isNaN(Date.parse(val))

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data

    return [...data].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]

      const isDate = isDateValue(aVal) && isDateValue(bVal)

      const valA = isDate ? new Date(aVal as string).getTime() : String(aVal).toLowerCase()
      const valB = isDate ? new Date(bVal as string).getTime() : String(bVal).toLowerCase()

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortKey, sortDirection])

  return {
    selected,
    allSelected,
    toggleSelect,
    selectAll,
    sortKey,
    sortDirection,
    handleSort,
    sortedData,
  }
}
