import React from "react";
import { type Player } from "@/utils/caroGameLogic";
import { PLAYER_COLORS } from "@/utils/colors";
import { useTranslation } from "../../hooks/useTranslation";

interface RoomInfoProps {
    turn: Player;
    gameEnded: boolean;
}

const RoomInfo: React.FC<RoomInfoProps> = ({ turn, gameEnded }) => {
    const { t } = useTranslation();
    
    return (
        <div style={{
            marginBottom: "16px",
            fontSize: "18px",
            fontWeight: "600",
            color: gameEnded ? "#9ca3af" : PLAYER_COLORS[turn]
        }}>
            {gameEnded ? t('room.gameEnded') : t('room.turnOf', { player: turn })}
        </div>
    );
};

export default RoomInfo; 