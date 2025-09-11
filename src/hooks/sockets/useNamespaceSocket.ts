import { useEffect, useCallback, useState } from "react";
import { useSocketContext } from "@/sockets/context/SocketProvider";


export const useNamespaceSocket = () => {
    const socket = useSocketContext()
    const [connected, setConnected] = useState(socket.connected)

    useEffect(() => {
        socket.on("connect", () => setConnected(true))
        socket.on("disconnect", () => setConnected(false))
        return () => {
            socket.off("connect")
            socket.off("disconnect")
        }
    }, [socket])

    const emit = useCallback(
        (event: string, data?: unknown) => socket.emit(event, data),
        [socket],
    )
    const on = useCallback(
        (event: string, cb: (...a: any[]) => void) => {
            socket.on(event, cb)
            return () => socket.off(event, cb)
        },
        [socket],
    )

    return { connected, emit, on }
}
