import React from "react"
import { type IGamePlayerInfo } from "@/features/game"
import { PLAYER_COLORS } from "@/utils/colors"
import { useTranslation } from "@/hooks/useTranslation"

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
    const { t } = useTranslation()


    const renderPlayerCard = (player: IGamePlayerInfo | null, symbol: "X" | "O") => {
        if (!player) {
            return (
                <div className="player-card waiting">
                    <div className="player-symbol" style={{ color: PLAYER_COLORS[symbol] }}>
                        {symbol}
                    </div>
                    <div className="player-name">{t('gamePage.waitingForPlayer')}</div>
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
                    {player.isCurrentUser && <span className="user-indicator"> ({t('gamePage.you')})</span>}
                </div>
                {!compact && isCurrentTurn && (
                    <div className="turn-indicator">
                        {player.isCurrentUser ? t('gamePage.yourTurn') : t('gamePage.playerTurn', { player: player.playerName })}
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
                        {t('gamePage.currentTurn', { player: currentPlayer })} <span style={{ color: PLAYER_COLORS[currentPlayer] }}>{currentPlayer}</span>
                        {(currentPlayer === "X" && playerX?.isCurrentUser) || (currentPlayer === "O" && playerO?.isCurrentUser) ? ` (${t('gamePage.you')})` : ""}
                    </div>
                    <div className="first-player-info">
                        {t('gamePage.firstPlayerInfo')}
                    </div>
                </div>
            )}
            
            {compact && gameActive && (
                <div className="compact-status">
                    {t('gamePage.turn', { player: currentPlayer })} <span style={{ color: PLAYER_COLORS[currentPlayer], fontWeight: 'bold' }}>{currentPlayer}</span>
                    {(currentPlayer === "X" && playerX?.isCurrentUser) || (currentPlayer === "O" && playerO?.isCurrentUser) ? ` (${t('gamePage.you')})` : ""}
                </div>
            )}
        </div>
    )
}

export default GamePlayerInfo
