import { apiClient } from '@/api/base/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { IAuthResponse, ICreateGuestRequest } from '../types';

export const authApi = {
    createGuest: async (data: ICreateGuestRequest): Promise<IAuthResponse> => {
        return await apiClient.post(API_ENDPOINTS.AUTH_GUEST, data)
    },

    logout: async (): Promise<void> => {
        return await apiClient.post(API_ENDPOINTS.AUTH_LOGOUT)
    },

    verifyToken: async (): Promise<IAuthResponse> => {
        return await apiClient.get(API_ENDPOINTS.AUTH_PROFILE)
    }
} 