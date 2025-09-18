import { type Player } from "./caroGameLogic"
import { type IGameStartedData, type IGamePlayerInfo } from "@/features/game"
import { type IUser } from "@/features/auth"

export function createGamePlayerInfo(
    gameData: IGameStartedData,
    currentUser: IUser | null,
    playerXName?: string,
    playerOName?: string
): {
    playerX: IGamePlayerInfo | null
    playerO: IGamePlayerInfo | null
} {
    const { players, gameState } = gameData
    
    const currentUserId = currentUser?.id
    const isUserPlayerX = currentUserId === players.playerXId
    const isUserPlayerO = currentUserId === players.playerOId
    
    const playerX: IGamePlayerInfo | null = players.playerXId ? {
        playerId: players.playerXId,
        playerSymbol: "X",
        playerName: playerXName || (isUserPlayerX ? currentUser?.name || "Bạn" : "Người chơi X"),
        isCurrentTurn: gameState.currentPlayer === "X",
        isCurrentUser: isUserPlayerX
    } : null
    
    const playerO: IGamePlayerInfo | null = players.playerOId ? {
        playerId: players.playerOId,
        playerSymbol: "O",
        playerName: playerOName || (isUserPlayerO ? currentUser?.name || "Bạn" : "Người chơi O"),
        isCurrentTurn: gameState.currentPlayer === "O",
        isCurrentUser: isUserPlayerO
    } : null
    
    return { playerX, playerO }
}


export function getCurrentPlayerInfo(
    currentPlayer: Player,
    playerX: IGamePlayerInfo | null,
    playerO: IGamePlayerInfo | null
): IGamePlayerInfo | null {
    return currentPlayer === "X" ? playerX : playerO
}


export function isCurrentUserTurn(
    currentPlayer: Player,
    playerX: IGamePlayerInfo | null,
    playerO: IGamePlayerInfo | null
): boolean {
    const currentPlayerInfo = getCurrentPlayerInfo(currentPlayer, playerX, playerO)
    return currentPlayerInfo?.isCurrentUser || false
}
