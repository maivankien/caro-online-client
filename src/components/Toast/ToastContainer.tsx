import React from 'react'
import { ToastItem } from './ToastItem'
import '../../styles/components/Toast.css'
import { useToast } from '../../contexts/ToastContext'

export const ToastContainer: React.FC = () => {
    const { toasts } = useToast()

    if (toasts.length === 0) {
        return null
    }

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
    )
} 