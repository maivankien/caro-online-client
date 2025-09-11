import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { roomApi } from "@/features/room"
import AppHeader from "@/components/AppHeader"
import { useTranslation } from "@/hooks/useTranslation"
import { useGameSocket } from "@/features/game"

const GamePage = () => {
    const { t } = useTranslation()
    const { roomId } = useParams<{ roomId: string }>()

    const { connected, emit, on } = useGameSocket()

    const { data: room } = useQuery({
        queryKey: ['room', roomId],
        queryFn: () => roomApi.getRoomDetail(roomId)
    })

    useEffect(() => {
        if (connected && roomId) {
            emit('game:join', { roomId })
        }
    }, [connected, roomId, emit])

    useEffect(() => {
        if (!connected) {
            return
        }

        const unsubscribeMove = on('game:move', (moveData) => {
            console.log('Player move:', moveData)
        })

        const unsubscribeGameEnd = on('game:end', (gameResult) => {
            console.log('Game ended:', gameResult)
        })

        const unsubscribePlayerLeft = on('game:player-left', (player) => {
            console.log('Player left game:', player)
        })

        return () => {
            unsubscribeMove()
            unsubscribeGameEnd()
            unsubscribePlayerLeft()
        }
    }, [connected, on])

    return (
        <div>
            <AppHeader title={t('game.title')} />
            <div>
                <h1>{t('game.title')}</h1>
                <p>Room: {room?.data?.name}</p>
              
            </div>
        </div>
    )
}

export default GamePage
