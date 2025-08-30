export interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
  timestamp?: number
}

export function createSuccessResponse<T>(data: T, message = 'success'): ApiResponse<T> {
  return {
    code: 0,
    message,
    data,
    timestamp: Date.now(),
  }
}

export function createErrorResponse(code: number, message: string): ApiResponse {
  return {
    code,
    message,
    timestamp: Date.now(),
  }
}

export function createPaginationResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number,
  message = 'success',
): ApiResponse<{
  list: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}> {
  return {
    code: 0,
    message,
    data: {
      list: data,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    },
    timestamp: Date.now(),
  }
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const API_CODE = {
  SUCCESS: 0,
  VALIDATION_ERROR: 1001,
  NOT_FOUND: 1002,
  UNAUTHORIZED: 1003,
  FORBIDDEN: 1004,
  INTERNAL_ERROR: 1005,
} as const
