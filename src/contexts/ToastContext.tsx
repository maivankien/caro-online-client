import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface IToast {
    id: string
    type: ToastType
    message: string
    duration?: number
}

interface IToastContextValue {
    toasts: IToast[]
    clearToasts: () => void
    removeToast: (id: string) => void
    showToast: (type: ToastType, message: string, duration?: number) => void
}

interface IToastProviderProps {
    children: React.ReactNode
}

const ToastContext = createContext<IToastContextValue | undefined>(undefined)


class ToastManager {
    private showToastFn: ((type: ToastType, message: string, duration?: number) => void) | null = null

    setShowToast(fn: (type: ToastType, message: string, duration?: number) => void) {
        this.showToastFn = fn
    }

    showToast(type: ToastType, message: string, duration?: number) {
        if (this.showToastFn) {
            this.showToastFn(type, message, duration)
        }
    }
}

export const toastManager = new ToastManager()

export function useToast(): IToastContextValue {
    const context = useContext(ToastContext)
    
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

export const ToastProvider: React.FC<IToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<IToast[]>([])

    const showToast = useCallback((type: ToastType, message: string, duration = 5000) => {
        const id = Date.now().toString() + Math.random().toString(36).substring(2, 11)
        const newToast: IToast = { id, type, message, duration }

        setToasts(prev => [...prev, newToast])

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    const clearToasts = useCallback(() => {
        setToasts([])
    }, [])

    // Đăng ký showToast với toast manager
    React.useEffect(() => {
        toastManager.setShowToast(showToast)
    }, [showToast])

    const value = useMemo(() => ({
        toasts,
        showToast,
        removeToast,
        clearToasts
    }), [toasts, showToast, removeToast, clearToasts])

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    )
} 