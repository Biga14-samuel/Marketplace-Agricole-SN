export type ExportFormat = 'csv' | 'excel' | 'pdf'

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
