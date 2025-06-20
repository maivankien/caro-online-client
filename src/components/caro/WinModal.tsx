import React from "react";
import { motion } from "framer-motion";
import { type Player } from "@/utils/caroGameLogic";
import { useTranslation } from "../../hooks/useTranslation";

interface WinModalProps {
    winner: Player;
    onPlayAgain: () => void;
    onReview: () => void;
}

const WinModal: React.FC<WinModalProps> = ({ winner, onPlayAgain, onReview }) => {
    const { t } = useTranslation();

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
        }}>
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{
                    backgroundColor: "white",
                    borderRadius: "20px",
                    padding: "40px",
                    textAlign: "center",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                    maxWidth: "400px",
                    width: "90%"
                }}
            >
                <div style={{
                    fontSize: "60px",
                    marginBottom: "20px"
                }}>
                    🎉
                </div>

                <h2 style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginBottom: "16px",
                    margin: 0
                }}>
                    {t('room.congratulations')}
                </h2>

                <p style={{
                    fontSize: "20px",
                    color: "#6b7280",
                    marginBottom: "30px",
                    margin: "0 0 30px 0"
                }}>
                    {t('room.playerWon', { player: winner })}
                </p>

                <div style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "center"
                }}>
                    <button
                        onClick={onPlayAgain}
                        style={{
                            padding: "12px 24px",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#2563eb";
                            e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#3b82f6";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        🔄 {t('room.playAgain')}
                    </button>

                    <button
                        onClick={onReview}
                        style={{
                            padding: "12px 24px",
                            backgroundColor: "#6b7280",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#4b5563";
                            e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#6b7280";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        👁️ {t('room.review')}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default WinModal; 