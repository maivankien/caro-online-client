import { useParams } from 'react-router-dom'
import { SocketProvider } from './SocketProvider'
import { type Namespace } from '../manager/SocketManager'

interface Props {
    namespace: Namespace
    children: React.ReactNode
}

export const RoomSocketProvider = ({ namespace, children }: Props) => {
    const { roomId } = useParams<{ roomId: string }>()
    
    const query = roomId ? { room_id: roomId } : undefined

    return (
        <SocketProvider namespace={namespace} query={query}>
            {children}
        </SocketProvider>
    )
}
