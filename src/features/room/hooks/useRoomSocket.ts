import { useNamespaceSocket } from "@/hooks/sockets/useNamespaceSocket";

export const useRoomSocket = () => {
    return useNamespaceSocket()
}