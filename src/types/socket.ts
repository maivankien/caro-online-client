export interface ISocketPlayer {
    id: string
    name: string
    isHost?: boolean
}

export interface ISocketEvents {
    'room:game-started': () => void
    'connect': () => void
    'disconnect': () => void
} 