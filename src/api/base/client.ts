import axios, { HttpStatusCode } from 'axios'
import { useAppStore } from '@/store'
import { toastManager } from '@/contexts/ToastContext'
import type { AxiosResponse } from 'axios'
import { API_CONFIG } from '@/config/api.config'


export const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
})

apiClient.interceptors.request.use(
    (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url)

        const { authToken } = useAppStore.getState()

        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`
        }

        return config
    },
    (error) => {
        throw error
    }
)

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response.data
    },
    (error) => {
        const errorMessage = error.response?.data?.message ?? error.message
        toastManager.showToast('error', errorMessage)

        if (error.response?.status === HttpStatusCode.Unauthorized) {
            useAppStore.getState().logout()
            window.location.href = '/'
        }

        throw error
    }
) 