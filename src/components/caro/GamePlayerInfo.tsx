import React from "react"
import { type IGamePlayerInfo } from "@/features/game"
import { PLAYER_COLORS } from "@/utils/colors"

interface IGamePlayerInfoProps {
    playerX: IGamePlayerInfo | null
    playerO: IGamePlayerInfo | null
    currentPlayer: "X" | "O"
    gameActive: boolean
    showGameStatus?: boolean
    compact?: boolean
}

const GamePlayerInfo: React.FC<IGamePlayerInfoProps> = ({ 
    playerX, 
    playerO, 
    currentPlayer, 
    gameActive,
    showGameStatus = true,
    compact = false
}) => {


    const renderPlayerCard = (player: IGamePlayerInfo | null, symbol: "X" | "O") => {
        if (!player) {
            return (
                <div className="player-card waiting">
                    <div className="player-symbol" style={{ color: PLAYER_COLORS[symbol] }}>
                        {symbol}
                    </div>
                    <div className="player-name">Đang chờ người chơi...</div>
                </div>
            )
        }

        const isCurrentTurn = gameActive && currentPlayer === symbol
        
        return (
            <div className={`player-card ${isCurrentTurn ? 'current-turn' : ''} ${player.isCurrentUser ? 'current-user' : ''}`}>
                <div className="player-symbol" style={{ color: PLAYER_COLORS[symbol] }}>
                    {symbol}
                </div>
                <div className="player-name">
                    {player.playerName}
                    {player.isCurrentUser && <span className="user-indicator"> (Bạn)</span>}
                </div>
                {!compact && isCurrentTurn && (
                    <div className="turn-indicator">
                        Lượt của {player.isCurrentUser ? 'bạn' : player.playerName}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={`game-player-info ${compact ? 'compact' : ''}`}>
            <div className="players-container">
                {renderPlayerCard(playerX, "X")}
                <div className="vs-divider">VS</div>
                {renderPlayerCard(playerO, "O")}
            </div>
            
            {showGameStatus && gameActive && !compact && (
                <div className="game-status">
                    <div className="current-turn-info">
                        Lượt hiện tại: <span style={{ color: PLAYER_COLORS[currentPlayer] }}>{currentPlayer}</span>
                        {(currentPlayer === "X" && playerX?.isCurrentUser) || (currentPlayer === "O" && playerO?.isCurrentUser) ? " (Bạn)" : ""}
                    </div>
                    <div className="first-player-info">
                        Người chơi X đi trước
                    </div>
                </div>
            )}
            
            {compact && gameActive && (
                <div className="compact-status">
                    Lượt: <span style={{ color: PLAYER_COLORS[currentPlayer], fontWeight: 'bold' }}>{currentPlayer}</span>
                    {(currentPlayer === "X" && playerX?.isCurrentUser) || (currentPlayer === "O" && playerO?.isCurrentUser) ? " (Bạn)" : ""}
                </div>
            )}
        </div>
    )
}

export default GamePlayerInfo
