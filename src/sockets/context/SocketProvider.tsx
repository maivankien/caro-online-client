import { useAppStore } from '@/store';
import { createContext, useContext, useMemo, useEffect } from 'react';
import { socketManager, type Namespace } from '../manager/SocketManager';


interface Props {
    namespace: Namespace;
    children: React.ReactNode;
    query?: Record<string, string>;
}

const SocketContext = createContext<ReturnType<typeof socketManager.get> | null>(null)

export const SocketProvider = ({ namespace, query, children }: Props) => {
    const { authToken } = useAppStore()
    const socket = useMemo(() => socketManager.connect(namespace, authToken, query), [namespace, authToken, query])

    useEffect(() => () => socketManager.disconnect(namespace), [namespace])

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export const useSocketContext = () => { 
    const ctx = useContext(SocketContext)

    if (!ctx) {
        throw new Error('useSocketContext must be used inside <SocketProvider>')
    }

    return ctx
}
