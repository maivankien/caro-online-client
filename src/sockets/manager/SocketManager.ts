import { io, Socket } from 'socket.io-client';
import { WEBSOCKET_URL } from '@/config/api.config';


export type Namespace = '/room' | '/game'

class SocketManager {
    private readonly sockets = new Map<Namespace, Socket>()

    connect(ns: Namespace, token?: string | null, query?: Record<string, string>) {
        const existingSocket = this.sockets.get(ns)
        
        if (existingSocket?.connected) {
            return existingSocket
        }

        if (existingSocket) {
            existingSocket.disconnect()
        }

        const socket = io(`${WEBSOCKET_URL}${ns}`, {
            auth: { token },
            query,
            transports: ['websocket'],
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 3,
        })

        this.sockets.set(ns, socket)
        return socket
    }

    disconnect(ns?: Namespace) {
        if (ns) {
            this.sockets.get(ns)?.disconnect()
            this.sockets.delete(ns)
        } else {
            this.sockets.forEach((s) => s.disconnect())
            this.sockets.clear()
        }
    }

    get(ns: Namespace) {
        return this.sockets.get(ns) ?? null
    }

    isConnected(ns: Namespace) {
        return this.sockets.get(ns)?.connected ?? false
    }
}

export const socketManager = new SocketManager()
