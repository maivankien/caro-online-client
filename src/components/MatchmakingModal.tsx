import { useAppStore } from '@/store'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/hooks/useTranslation'
import { socketManager } from '@/sockets/manager/SocketManager'
import '@/styles/components/MatchmakingModal.css'
import { toastManager } from '@/contexts/ToastContext'
import { EVENT_SOCKET_CONSTANTS } from '@/constants/socket.constants'

interface IMatchmakingModalProps {
    readonly isOpen: boolean
    readonly onClose: () => void
}

interface IMatchmakingData {
    boardSize: number
    winCondition: number
}

interface IMatchmakingFoundData {
    roomId: string
}

export default function MatchmakingModal({ isOpen, onClose }: IMatchmakingModalProps) {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { authToken } = useAppStore()

    const [formData, setFormData] = useState<IMatchmakingData>({
        boardSize: 15,
        winCondition: 5
    })

    const [isSearching, setIsSearching] = useState(false)
    const [socket, setSocket] = useState<any>(null)

    useEffect(() => {
        if (isOpen && authToken) {
            const matchmakingSocket = socketManager.connect('/matchmaking', authToken)
            setSocket(matchmakingSocket)

            const handleMatchmakingFound = (data: IMatchmakingFoundData) => {
                setIsSearching(false)
                onClose()

                if (socket) {
                    socket.disconnect()
                }

                navigate(`/game/${data.roomId}`)
            }

            matchmakingSocket.on(EVENT_SOCKET_CONSTANTS.MATCHMAKING_FOUND, handleMatchmakingFound)

            return () => {
                matchmakingSocket.off(EVENT_SOCKET_CONSTANTS.MATCHMAKING_FOUND, handleMatchmakingFound)
                socketManager.disconnect('/matchmaking')
            }
        }
    }, [isOpen, authToken, navigate, onClose])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!socket) {
            return toastManager.showToast('error', t('socket.socketNotConnected'))
        }

        setIsSearching(true)

        try {
            socket.emit(EVENT_SOCKET_CONSTANTS.MATCHMAKING, {
                boardSize: formData.boardSize,
                winCondition: formData.winCondition
            })
        } catch (error) {
            console.error('Failed to start matchmaking:', error)
            setIsSearching(false)
        }
    }

    const handleInputChange = (field: keyof IMatchmakingData, value: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleCancel = () => {
        if (socket && isSearching) {
            socket.emit(EVENT_SOCKET_CONSTANTS.MATCHMAKING_CANCEL)
        }
        setIsSearching(false)
        onClose()
    }

    if (!isOpen) {
        return null
    }

    return (
        <div
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="matchmaking-modal-title"
        >
            <div
                className="modal-content matchmaking-modal"
            >
                <h2 id="matchmaking-modal-title" className="modal-title">
                    {t('matchmaking.title')}
                </h2>

                {!isSearching ? (
                    <form onSubmit={handleSubmit} className="modal-form">
                        <div className="form-group">
                            <label htmlFor="boardSize" className="form-label">
                                {t('createRoomForm.boardSize')}
                            </label>
                            <select
                                id="boardSize"
                                value={formData.boardSize}
                                onChange={(e) => handleInputChange('boardSize', parseInt(e.target.value))}
                                className="form-select"
                            >
                                <option value={15}>{t('createRoomForm.boardSizeOptions.15x15')}</option>
                                <option value={19}>{t('createRoomForm.boardSizeOptions.19x19')}</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="winCondition" className="form-label">
                                {t('createRoomForm.winCondition')}
                            </label>
                            <select
                                id="winCondition"
                                value={formData.winCondition}
                                onChange={(e) => handleInputChange('winCondition', parseInt(e.target.value))}
                                className="form-select"
                            >
                                <option value={5}>{t('createRoomForm.winConditionOptions.5')}</option>
                                <option value={4}>{t('createRoomForm.winConditionOptions.4')}</option>
                                <option value={3}>{t('createRoomForm.winConditionOptions.3')}</option>
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-secondary"
                            >
                                {t('buttons.cancel')}
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                {t('matchmaking.findMatch')}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="matchmaking-search">
                        <div className="search-spinner"></div>
                        <p className="search-text">{t('matchmaking.searching')}</p>
                        <p className="search-subtitle">{t('matchmaking.searchingSubtitle')}</p>
                        <button
                            onClick={handleCancel}
                            className="btn btn-secondary cancel-search-btn"
                        >
                            {t('matchmaking.cancel')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
