import '../styles/pages/RoomPage.css'
import '../styles/components/RoomList.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RoomList, CreateRoomModal } from '@/features/room/components'
import { useTranslation } from '../hooks/useTranslation'
import { authApi } from '@/features/auth/services/authApi'
import AppHeader from '@/components/AppHeader'

const RoomPage = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false)
    const { t } = useTranslation()

    useEffect(() => {
        const checkAuth = async () => {
            await authApi.verifyToken()
            setIsLoading(false)
        }

        checkAuth()
    }, [navigate])

    const handleOpenCreateRoom = () => {
        setIsCreateRoomModalOpen(true)
    }

    const handleCloseCreateRoom = () => {
        setIsCreateRoomModalOpen(false)
    }

    if (isLoading) {
        return (
            <div className="room-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>{t('room.loading')}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="room-page">
            <AppHeader title={t('room.title')} />
            
            <main className="room-content">
                <div className="room-actions">
                    <button 
                        onClick={handleOpenCreateRoom}
                        className="create-room-btn"
                    >
                        {t('gamePage.createRoom')}
                    </button>
                </div>
                
                <RoomList />
            </main>

            <CreateRoomModal 
                isOpen={isCreateRoomModalOpen} 
                onClose={handleCloseCreateRoom} 
            />
        </div>
    )
}

export default RoomPage 