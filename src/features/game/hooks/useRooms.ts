import { gameApi } from '../services/gameApi'
import type { ICreateRoomRequest } from '../types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

export const useRooms = () => {
    const queryClient = useQueryClient()
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(8)

    const {
        data: roomsData,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['rooms', currentPage, pageSize],
        queryFn: () => {
            console.log('🔄 Fetching rooms at:', new Date().toLocaleTimeString())
            return gameApi.getRooms({ page: currentPage, limit: pageSize })
        },
        refetchInterval: 5000, // Auto-refresh every 5 seconds
        refetchIntervalInBackground: true, // Continue refreshing even when tab is not active
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        staleTime: 1000, // Cache for 1 second to prevent too frequent updates
        gcTime: 10000, // Keep in cache for 10 seconds
    })

    const rooms = useMemo(() => {
        if (!roomsData?.data?.rooms) {
            return []
        }
        return roomsData.data.rooms
    }, [roomsData])

    const total = useMemo(() => {
        return roomsData?.data?.total ?? 0
    }, [roomsData])

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

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    return {
        rooms,
        total,
        currentPage,
        pageSize,
        isLoading,
        error,
        refetch,
        createRoom,
        joinRoom,
        handlePageChange,
        isCreating: createRoomMutation.isPending,
        isJoining: joinRoomMutation.isPending,
        createError: createRoomMutation.error,
        joinError: joinRoomMutation.error,
    }
} 