import '@/styles/pages/RoomLobbyPage.css'
import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from '@/hooks/useTranslation'
import { useRoomSocket } from '@/features/room/hooks/useRoomSocket'
import { roomApi } from '@/features/room/services/roomApi'
import AppHeader from '@/components/AppHeader'
import type { IRoom } from '@/features/room/types'
import { EVENT_SOCKET_CONSTANTS } from '@/constants/socket.constants'

const RoomLobbyPage = () => {
    const { roomId } = useParams<{ roomId: string }>()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(true)
    const [room, setRoom] = useState<IRoom | null>(null)
    const [error, setError] = useState<string>('')

    const { connected, emit, on } = useRoomSocket()

    const handleBackToRooms = useCallback(() => {
        if (roomId) {
            emit('room:leave', { roomId })
        }
        navigate('/room')
    }, [emit, navigate, roomId])

    const handleUserJoinRoom = useCallback(() => {
        navigate(`/game/${roomId}`)
    }, [navigate, roomId])

    useEffect(() => {
        const loadRoomData = async () => {
            try {
                if (roomId) {
                    const roomResponse = await roomApi.getRoomDetail(roomId)
                    setRoom(roomResponse.data)
                }

                setIsLoading(false)
            } catch (error) {
                console.error('Failed to load room:', error)
                setError('Failed to load room')
                setIsLoading(false)
            }
        }

        loadRoomData()
    }, [roomId])

    useEffect(() => {
        if (connected && roomId) {
            emit('room:join', { roomId })
        }
    }, [connected, roomId, emit])

    useEffect(() => {
        if (!connected) {
            return
        }

        const unsubscribeGameStart = on(EVENT_SOCKET_CONSTANTS.ROOM_JOINED, handleUserJoinRoom)

        return () => {
            unsubscribeGameStart()
        }
    }, [connected, on, handleUserJoinRoom])

    if (isLoading) {
        return (
            <div className="room-lobby-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>{t('room.loading')}</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="room-lobby-page">
                <AppHeader title={t('room.title')} />
                <div className="error-container">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={handleBackToRooms} className="btn btn-primary">
                        {t('buttons.back')}
                    </button>
                </div>
            </div>
        )
    }

    if (!room) {
        return (
            <div className="room-lobby-page">
                <AppHeader title={t('room.title')} />
                <div className="error-container">
                    <h2>Room not found</h2>
                    <button onClick={handleBackToRooms} className="btn btn-primary">
                        {t('buttons.back')}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="room-lobby-page">
            <AppHeader title={t('room.title')} />

            <main className="room-lobby-content">
                <div className="room-info-card">
                    <h2>{room.name}</h2>
                    <div className="room-details">
                        <div className="detail-item">
                            <span className="label">
                                {t('roomList.createdBy')}
                                <span className="value">{room.host.name}</span>
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="label">
                                {t('roomList.boardSize')}
                                <span className="value">{room.boardSize}</span>
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="label">
                                {t('roomList.winCondition')}
                                <span className="value">{room.winCondition}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="waiting-section">
                    <div className="waiting-message">
                        <div className="spinner"></div>
                        <h3>{t('room.waiting')}</h3>
                    </div>
                </div>

                <div className="room-actions">
                    <button onClick={handleBackToRooms} className="btn btn-secondary">
                        {t('buttons.back')}
                    </button>
                </div>
            </main>
        </div>
    )
}

export default RoomLobbyPage 