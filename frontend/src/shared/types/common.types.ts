// Shared common types used across modules

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json'

export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface SortParams {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FilterParams {
  search?: string
  // Paramètres de filtre dynamiques avec types spécifiques
  [key: string]: string | number | boolean | Date | undefined
}

export interface DateRange {
  startDate: string | Date
  endDate: string | Date
}

export interface SelectOption {
  label: string
  value: string | number
}

export interface FileUpload {
  file: File
  preview?: string
  progress?: number
}
