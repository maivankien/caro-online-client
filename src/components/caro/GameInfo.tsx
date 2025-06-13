import React from "react";
import { type Player } from "@/utils/caroGameLogic";
import { PLAYER_COLORS } from "@/utils/colors";
import { useTranslation } from "../../hooks/useTranslation";

interface GameInfoProps {
    turn: Player;
    gameEnded: boolean;
}

const GameInfo: React.FC<GameInfoProps> = ({ turn, gameEnded }) => {
    const { t } = useTranslation();
    
    return (
        <div style={{
            marginBottom: "16px",
            fontSize: "18px",
            fontWeight: "600",
            color: gameEnded ? "#9ca3af" : PLAYER_COLORS[turn]
        }}>
            {gameEnded ? t('game.gameEnded') : t('game.turnOf', { player: turn })}
        </div>
    );
};

export default GameInfo; 