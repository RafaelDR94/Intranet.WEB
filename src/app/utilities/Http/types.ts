export type StatusRange = readonly [min: number, max: number]

export type NormalizedError = {
  message: string
  status?: number
  code?: string | number
  details?: unknown
}