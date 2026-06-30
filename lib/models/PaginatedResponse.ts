export type PaginatedResponse<T> = {
  data: T[]
  total: number
  start: number
  length: number
}