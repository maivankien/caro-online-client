import { useEffect, useCallback, useState } from "react";
import { useSocketContext } from "@/sockets/context/SocketProvider";


export const useNamespaceSocket = () => {
    const socket = useSocketContext()
    const [connected, setConnected] = useState(socket.connected)
    const [connecting, setConnecting] = useState(!socket.connected)

    useEffect(() => {
        const handleConnect = () => {
            console.log('Socket connected successfully')
            setConnected(true)
            setConnecting(false)
        }
        
        const handleDisconnect = () => {
            console.log('Socket disconnected')
            setConnected(false)
            setConnecting(false)
        }

        const handleConnectError = (error: any) => {
            console.error('Socket connection error:', error)
            setConnecting(false)
        }

        socket.on("connect", handleConnect)
        socket.on("disconnect", handleDisconnect)
        socket.on("connect_error", handleConnectError)

        if (!socket.connected) {
            setConnecting(true)
            socket.connect()
        }

        return () => {
            socket.off("connect", handleConnect)
            socket.off("disconnect", handleDisconnect)
            socket.off("connect_error", handleConnectError)
        }
    }, [socket])

    const emit = useCallback(
        (event: string, data?: unknown) => {
            if (socket.connected) {
                socket.emit(event, data)
            } else {
                console.warn('Socket not connected, cannot emit event:', event)
            }
        },
        [socket],
    )
    
    const on = useCallback(
        (event: string, cb: (...a: any[]) => void) => {
            socket.on(event, cb)
            return () => socket.off(event, cb)
        },
        [socket],
    )

    return { connected, connecting, emit, on }
}
