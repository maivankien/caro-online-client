import React from "react";
import { motion } from "framer-motion";
import { type Player } from "@/utils/caroGameLogic";
import { PLAYER_COLORS } from "@/utils/colors";

interface BoardCellProps {
    value: Player | null;
    cellSize: number;
    isWinning: boolean;
    gameEnded: boolean;
    onClick: () => void;
}

const BoardCell: React.FC<BoardCellProps> = ({
    value,
    cellSize,
    isWinning,
    gameEnded,
    onClick
}) => {
    return (
        <motion.button
            onClick={onClick}
            disabled={gameEnded}
            animate={isWinning ? {
                boxShadow: [
                    "0 0 8px rgba(251, 191, 36, 0.4)",
                    "0 0 16px rgba(245, 158, 11, 0.6)",
                    "0 0 8px rgba(251, 191, 36, 0.4)"
                ]
            } : {}}
            transition={isWinning ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            } : {}}
            style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: gameEnded ? "#1f2937" : "#262626",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: gameEnded ? "not-allowed" : "pointer",
                border: "1px solid #525252",
                transition: "all 0.2s ease",
                padding: 0,
                outline: "none",
                opacity: gameEnded && !isWinning ? 0.7 : 1,
                boxShadow: isWinning ? "0 0 8px rgba(251, 191, 36, 0.4)" : "none"
            }}
            onMouseEnter={(e) => {
                if (!gameEnded && !isWinning) {
                    e.currentTarget.style.backgroundColor = "#374151";
                    e.currentTarget.style.boxShadow = "0 0 0 2px #06b6d4";
                }
            }}
            onMouseLeave={(e) => {
                if (!gameEnded && !isWinning) {
                    e.currentTarget.style.backgroundColor = "#262626";
                    e.currentTarget.style.boxShadow = "none";
                }
            }}
        >
            {value && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{
                        fontSize: `${cellSize * 0.6}px`,
                        fontWeight: "900",
                        fontFamily: "monospace",
                        color: PLAYER_COLORS[value],
                        textShadow: isWinning ?
                            `0 0 8px ${PLAYER_COLORS[value]}, 0 0 16px ${PLAYER_COLORS[value]}` :
                            `0 0 8px ${PLAYER_COLORS[value]}`,
                        userSelect: "none",
                        pointerEvents: "none"
                    }}
                >
                    {value}
                </motion.div>
            )}
        </motion.button>
    );
};

export default BoardCell; 