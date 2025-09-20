import { type Player } from "@/utils/caroGameLogic"

export interface IGameState {
    board: (Player | null)[][]
    currentPlayer: Player
    isGameActive: boolean
    moveCount: number
    startTime: string
}

export interface IGamePlayers {
    playerXId: string
    playerOId: string
}

export interface IGameStartedData {
    gameState: IGameState
    players: IGamePlayers
}

export interface IGameStateSyncPayload {
    gameState: IGameState
    players: IGamePlayers
    winner?: Player | null
    winningLine?: IWinningPosition[]
}

export interface IGamePlayerInfo {
    playerId: string
    playerSymbol: Player
    playerName: string
    isCurrentTurn: boolean
    isCurrentUser: boolean
}

export interface IMakeMoveDto {
    row: number
    col: number
}

export interface IGameMove {
    row: number
    col: number
    player: 'X' | 'O'
    timestamp: string
}

export interface IGameMovePayload {
    move: IGameMove
    gameState: IGameState
}

export interface IGameCountdownPayload {
    countdown: number
}

export interface IWinningPosition {
    row: number
    col: number
}

export interface IGameFinishedPayload {
    winner: Player | null
    winningLine: IWinningPosition[]
    gameState: IGameState
    message: string
}
