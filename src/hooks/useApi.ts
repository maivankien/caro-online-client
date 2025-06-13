import { useState, useCallback } from 'react'
import { apiClient } from '@/api'
import { useAppStore } from '@/store'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

interface IApiHookResult<T = any> {
    data: T | null
    loading: boolean
    error: string | null
    execute: (config: AxiosRequestConfig) => Promise<T>
}

export const useApi = <T = any>(): IApiHookResult<T> => {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { setError: setStoreError } = useAppStore()

    const execute = useCallback(async (config: AxiosRequestConfig): Promise<T> => {
        try {
            setLoading(true)
            setError(null)

            const response: AxiosResponse<T> = await apiClient(config)
            setData(response.data)
            return response.data
        } catch (err: any) {
            const errorMessage = err.response?.data?.message ?? err.message
            setError(errorMessage)
            setStoreError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }, [setStoreError])

    return {
        data,
        loading,
        error,
        execute
    }
} 