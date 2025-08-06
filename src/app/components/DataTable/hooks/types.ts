export type Table<T> = {
  data: T[]
}

export interface UseDataTableParams<T extends { id: string | number }> {
  onSearchChange?: (value: string) => void
  enableInternalSearch?: boolean
  searchableKeys?: (keyof T)[]
}