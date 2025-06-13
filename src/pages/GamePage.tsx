import '../styles/pages/GamePage.css'
import '../styles/components/RoomList.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RoomList, CreateRoomModal } from '@/features/game/components'
import { useTranslation } from '../hooks/useTranslation'
import { authApi } from '@/features/auth/services/authApi'
import AppHeader from '@/components/AppHeader'

const GamePage = () => {
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
            <div className="game-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>{t('game.loading')}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="game-page">
            <AppHeader title={t('game.title')} />
            
            <main className="game-content">
                <div className="game-actions">
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

export default GamePage 