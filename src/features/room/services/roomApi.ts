import type {
    ICreateRoomRequest,
    ICreateRoomResponse,
    IRoomListResponse,
    IJoinRoomRequest,
    IJoinRoomResponse,
    IRoom,
    ICreateAIRoomRequest,
    ICreateAIRoomResponse,
} from '../types';
import { apiClient } from '@/api/base/client';
import { API_ENDPOINTS } from '@/config/api.config';

interface IRoomListParams {
    page?: number
    limit?: number
}

interface IRoomDetailResponse {
    data: IRoom
    message: string
}

export const roomApi = {
    getRooms: async (params?: IRoomListParams): Promise<IRoomListResponse> => {
        const queryParams = new URLSearchParams()
        if (params?.page) {
            queryParams.append('page', params.page.toString())
        }
        if (params?.limit) {
            queryParams.append('limit', params.limit.toString())
        }
        
        const url = queryParams.toString() 
            ? `${API_ENDPOINTS.ROOM_LIST}?${queryParams.toString()}`
            : API_ENDPOINTS.ROOM_LIST
            
        return await apiClient.get(url)
    },

    getRoomDetail: async (roomId: string | undefined): Promise<IRoomDetailResponse> => {
        return await apiClient.get(`${API_ENDPOINTS.ROOM_LIST}/${roomId}`)
    },

    createRoom: async (data: ICreateRoomRequest): Promise<ICreateRoomResponse> => {
        return await apiClient.post(API_ENDPOINTS.ROOM_CREATE, data)
    },

    joinRoom: async (data: IJoinRoomRequest): Promise<IJoinRoomResponse> => {
        return await apiClient.post(API_ENDPOINTS.ROOM_JOIN, {
            roomId: data.roomId,
            password: data.password
        })
    },

    createAIRoom: async (data: ICreateAIRoomRequest): Promise<ICreateAIRoomResponse> => {
        return await apiClient.post(API_ENDPOINTS.ROOM_AI, data)
    },
} 