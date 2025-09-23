import React, { useState, useEffect } from 'react'
import type { IToast } from '../../contexts/ToastContext'
import { useToast } from '../../contexts/ToastContext'

interface IToastItemProps {
    toast: IToast
}

export const ToastItem: React.FC<IToastItemProps> = ({ toast }) => {
    const { removeToast } = useToast()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 50)
        return () => clearTimeout(timer)
    }, [])

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(() => removeToast(toast.id), 300)
    }
    

    const getIcon = () => {
        const map = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        } as const

        return map[toast.type]
    }

    return (
        <div
            className={`toast-item toast-${toast.type} ${isVisible ? 'toast-visible' : ''}`}
            onClick={handleClose}
            role="button"
            tabIndex={0}
            aria-label={`${toast.type} notification: ${toast.message}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleClose()
                }
            }}
        >
            <div className="toast-icon">
                {getIcon()}
            </div>
            <div className="toast-message">
                {toast.message}
            </div>
            <button
                className="toast-close"
                onClick={(e) => {
                    e.stopPropagation()
                    handleClose()
                }}
                aria-label="Close notification"
                type="button"
            >
                ×
            </button>
        </div>
    )
} 