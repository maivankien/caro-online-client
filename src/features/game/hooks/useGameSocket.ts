import { useNamespaceSocket } from "@/hooks/sockets/useNamespaceSocket"

export const useGameSocket = () => {
    return useNamespaceSocket()
}
