import { useState } from 'react'
import { Table ,UseDataTableParams} from './types'


const useDataTable = <T extends { id: string | number }>({
  onSearchChange,
  enableInternalSearch = true,
  searchableKeys,
}: UseDataTableParams<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange?.(value)
  }

  const getFilteredData = (table: Table<T>): T[] => {
    const term = searchTerm.trim().toLowerCase()
    if (!enableInternalSearch || !term) return table.data

    const keys = searchableKeys ?? (Object.keys(table.data[0] || {}) as (keyof T)[])

    return table.data.filter((row) =>
      keys.some((key) =>
        String(row[key] ?? '').toLowerCase().includes(term)
      )
    )
  }

  return {
    searchTerm,
    setSearchTerm,
    handleSearchChange,
    getFilteredData,
  }
}

export default useDataTable
