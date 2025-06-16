import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRooms } from '../hooks/useRooms'
import type { ICreateRoomRequest } from '../types'
import { useTranslation } from '@/hooks/useTranslation'
import '@/styles/components/CreateRoomModal.css'

interface ICreateRoomModalProps {
    isOpen: boolean
    onClose: () => void
}

export const CreateRoomModal = ({ isOpen, onClose }: ICreateRoomModalProps) => {
    const navigate = useNavigate()
    const { createRoom, isCreating, createError } = useRooms()
    const { t } = useTranslation()

    const [formData, setFormData] = useState<ICreateRoomRequest>({
        name: '',
        password: '',
        boardSize: 15,
        winCondition: 5,
        isPrivate: false
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const roomData = {
                ...formData,
                password: formData.password ?? undefined
            }

            const result = await createRoom(roomData)
            onClose()

            setFormData({
                name: '',
                password: '',
                boardSize: 15,
                winCondition: 5,
                isPrivate: false
            })

            if (result?.data?.id) {
                navigate(`/room/${result.data.id}`)
            }
            
        } catch (error) {
            console.error('Failed to create room:', error)
        }
    }

    const handleInputChange = (field: keyof ICreateRoomRequest, value: string | number | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    if (!isOpen) {
        return null
    }

    return (
        <button
            className="modal-overlay"
            onClick={handleOverlayClick}
            type="button"
            aria-label={t('buttons.closeModal')}
        >
            <button className="modal-content" onClick={handleContentClick}>
                <h2 className="modal-title">{t('createRoomForm.title')}</h2>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="roomName" className="form-label">
                            {t('createRoomForm.roomNameRequired')}
                        </label>
                        <input
                            id="roomName"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                            className="form-input"
                            placeholder={t('createRoomForm.roomNamePlaceholder')}
                        />
                    </div>

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

                    <div className="checkbox-group">
                        <input
                            id="isPrivate"
                            type="checkbox"
                            checked={formData.isPrivate}
                            onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                            className="form-checkbox"
                        />
                        <label htmlFor="isPrivate" className="checkbox-label">
                            {t('createRoomForm.hasPassword')}
                        </label>
                    </div>

                    {formData.isPrivate && (
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                {t('createRoomForm.password')}
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={formData.password ?? ''}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className="form-input"
                                placeholder={t('createRoomForm.passwordPlaceholder')}
                            />
                        </div>
                    )}

                    {createError && (
                        <div className="error-message">
                            {createError.message || t('toast.roomCreateError')}
                        </div>
                    )}

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            disabled={isCreating}
                        >
                            {t('buttons.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating || !formData.name.trim()}
                            className="btn btn-primary"
                        >
                            {isCreating ? t('createRoomForm.creating') : t('createRoomForm.createBtn')}
                        </button>
                    </div>
                </form>
            </button>
        </button>
    )
} 