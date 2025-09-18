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
                backgroundColor: gameEnded ? "#f1f5f9" : "#ffffff",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: gameEnded ? "not-allowed" : "pointer",
                border: "1px solid #e5e7eb",
                transition: "all 0.2s ease",
                padding: 0,
                outline: "none",
                opacity: gameEnded && !isWinning ? 0.7 : 1,
                boxShadow: isWinning ? "0 0 8px rgba(251, 191, 36, 0.4)" : "0 1px 3px rgba(0, 0, 0, 0.1)"
            }}
            onMouseEnter={(e) => {
                if (!gameEnded && !isWinning) {
                    e.currentTarget.style.backgroundColor = "#f0f9ff";
                    e.currentTarget.style.boxShadow = "0 0 0 2px #3b82f6";
                    e.currentTarget.style.borderColor = "#3b82f6";
                }
            }}
            onMouseLeave={(e) => {
                if (!gameEnded && !isWinning) {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.borderColor = "#e5e7eb";
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