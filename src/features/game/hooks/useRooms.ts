import { gameApi } from '../services/gameApi'
import type { ICreateRoomRequest } from '../types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useRooms = () => {
    const queryClient = useQueryClient()

    const {
        data: roomsData,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['rooms'],
        queryFn: gameApi.getRooms,
        refetchInterval: 5000, // Refetch every 5 seconds
    })

    const createRoomMutation = useMutation({
        mutationFn: gameApi.createRoom,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] })
        },
    })

    const joinRoomMutation = useMutation({
        mutationFn: gameApi.joinRoom,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] })
        },
    })

    const createRoom = async (roomData: ICreateRoomRequest) => {
        return createRoomMutation.mutateAsync(roomData)
    }

    const joinRoom = async (roomId: string, password?: string) => {
        return joinRoomMutation.mutateAsync({ roomId, password })
    }


    return {
        rooms: roomsData?.data.rooms || [],
        isLoading,
        error,
        refetch,
        createRoom,
        joinRoom,
        isCreating: createRoomMutation.isPending,
        isJoining: joinRoomMutation.isPending,
        createError: createRoomMutation.error,
        joinError: joinRoomMutation.error,
    }
} 