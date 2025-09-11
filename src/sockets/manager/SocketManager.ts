import { io, Socket } from 'socket.io-client';
import { WEBSOCKET_URL } from '@/config/api.config';


export type Namespace = '/room' | '/game'

class SocketManager {
    private readonly sockets = new Map<Namespace, Socket>()

    connect(ns: Namespace, token?: string | null, query?: Record<string, string>) {
        if (this.sockets.get(ns)?.connected) {
            return this.sockets.get(ns)!
        }

        const socket = io(`${WEBSOCKET_URL}${ns}`, {
            auth: { token },
            query,
            transports: ['websocket'],
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
}

export const socketManager = new SocketManager()
