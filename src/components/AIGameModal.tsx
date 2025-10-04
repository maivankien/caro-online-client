import { useState } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import '../styles/components/AIGameModal.css'

interface IAIGameModalProps {
    isOpen: boolean
    onClose: () => void
    onStartGame: (boardSize: number) => Promise<void>
}

const AIGameModal = ({ isOpen, onClose, onStartGame }: IAIGameModalProps) => {
    const [selectedBoardSize, setSelectedBoardSize] = useState<number>(15)
    const [isLoading, setIsLoading] = useState(false)
    const { t } = useTranslation()

    const boardSizeOptions = [
        { value: 15, label: '15x15' },
        { value: 19, label: '19x19' },
    ]

    const handleStartGame = async () => {
        setIsLoading(true)
        try {
            await onStartGame(selectedBoardSize)
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) {
        return null
    }

    return (
        <div className="ai-game-modal-overlay">
            <div className="ai-game-modal">
                <div className="ai-game-modal-header">
                    <h2>{t('aiGame.title')}</h2>
                    <button
                        className="ai-game-modal-close"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        ×
                    </button>
                </div>

                <div className="ai-game-modal-content">
                    <div className="ai-game-modal-section">
                        <label className="ai-game-modal-label">
                            {t('aiGame.selectBoardSize')}
                        </label>
                        <div className="ai-game-modal-options">
                            {boardSizeOptions.map((option) => (
                                <label
                                    key={option.value}
                                    className={`ai-game-modal-option ${selectedBoardSize === option.value ? 'selected' : ''
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="boardSize"
                                        value={option.value}
                                        checked={selectedBoardSize === option.value}
                                        onChange={(e) => setSelectedBoardSize(Number(e.target.value))}
                                        disabled={isLoading}
                                    />
                                    <span>{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="ai-game-modal-footer">
                    <button
                        className="ai-game-modal-cancel"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        className="ai-game-modal-start"
                        onClick={handleStartGame}
                        disabled={isLoading}
                    >
                        {isLoading ? t('aiGame.starting') : t('aiGame.startGame')}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AIGameModal
