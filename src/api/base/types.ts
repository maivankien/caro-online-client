// Base API Response Interface
export interface IApiResponse<T = any> {
    data?: T
    message?: string
    statusCode?: number
}

// Base API Error Interface
export interface IApiError {
    message: string
    statusCode: number
}

// Common Request/Response patterns
export interface IPaginationRequest {
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
