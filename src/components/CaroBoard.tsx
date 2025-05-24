import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * Caro (Gomoku) board UI component – V3
 * ------------------------------------------------------
 * ✅ Luôn là hình vuông & căn giữa màn hình (flex‑center cả trục X/Y)
 * ✅ Hiển thị X màu đỏ (#ef4444 ‑ red‑500) & O màu xanh (#3b82f6 ‑ blue‑500)
 * ✅ Tránh bị lệch do khoảng cách (gap) giữa các ô: width & height = size*cell + (size‑1)*gap
 * ✅ Prop `gap` tùy chỉnh (mặc định 2px) – đổi đồng bộ width/height và style `gap`
 * ------------------------------------------------------
 * Props
 *  - size  : số hàng = số cột (mặc định 15)
 *  - cell  : kích thước 1 ô (px, mặc định 40)
 *  - gap   : khoảng cách giữa ô (px, mặc định 2)
 *  - onMove?: callback (row, col, player)
 *
 * Example:
 * ```tsx
 * <CaroBoard size={19} cell={32} gap={2} />
 * ```
 */

export type Player = "X" | "O";

interface CaroBoardProps {
    size?: number;
    cellSize?: number;
    onMove?: (row: number, col: number, player: Player) => void;
}

const CaroBoard: React.FC<CaroBoardProps> = ({ size = 15, cellSize = 40, onMove }) => {
    const [board, setBoard] = useState<(Player | null)[][]>(
        () => Array.from({ length: size }, () => Array<Player | null>(size).fill(null))
    );
    const [turn, setTurn] = useState<Player>("X");
    const [winner, setWinner] = useState<Player | null>(null);
    const [winningPositions, setWinningPositions] = useState<[number, number][]>([]);

    // Kiểm tra chiến thắng và trả về vị trí các ô chiến thắng
    const checkWin = (board: (Player | null)[][], row: number, col: number, player: Player): [number, number][] | null => {
        const directions = [
            [0, 1],   // ngang (horizontal)
            [1, 0],   // dọc (vertical)
            [1, 1],   // chéo chính (diagonal \)
            [1, -1]   // chéo phụ (diagonal /)
        ];

        for (const [dx, dy] of directions) {
            const positions: [number, number][] = [[row, col]]; // bắt đầu với ô hiện tại

            // Đếm về phía trước
            let x = row + dx;
            let y = col + dy;
            while (x >= 0 && x < size && y >= 0 && y < size && board[x][y] === player) {
                positions.push([x, y]);
                x += dx;
                y += dy;
            }

            // Đếm về phía sau
            x = row - dx;
            y = col - dy;
            while (x >= 0 && x < size && y >= 0 && y < size && board[x][y] === player) {
                positions.unshift([x, y]); // thêm vào đầu để giữ thứ tự
                x -= dx;
                y -= dy;
            }

            // Nếu có 5 hoặc nhiều hơn thì thắng
            if (positions.length >= 5) {
                return positions;
            }
        }

        return null;
    };

    const handleClick = (r: number, c: number) => {
        if (board[r][c] || winner) return;

        const next = board.map((row) => [...row]);
        next[r][c] = turn;
        setBoard(next);

        // Kiểm tra chiến thắng
        const winPositions = checkWin(next, r, c, turn);
        if (winPositions) {
            setWinner(turn);
            setWinningPositions(winPositions);
        }

        onMove?.(r, c, turn);
        setTurn((prev) => (prev === "X" ? "O" : "X"));
    };

    const resetGame = () => {
        setBoard(Array.from({ length: size }, () => Array<Player | null>(size).fill(null)));
        setTurn("X");
        setWinner(null);
        setWinningPositions([]);
    };

    // Kiểm tra xem ô có phải là ô chiến thắng không
    const isWinningPosition = (row: number, col: number): boolean => {
        return winningPositions.some(([r, c]) => r === row && c === col);
    };

    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#171717",
            padding: "20px",
            position: "relative"
        }}>
            {/* Modal thông báo chiến thắng */}
            {winner && (
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
                            Chúc mừng!
                        </h2>

                        <p style={{
                            fontSize: "20px",
                            color: "#6b7280",
                            marginBottom: "30px",
                            margin: "0 0 30px 0"
                        }}>
                            Người chơi <span style={{
                                color: winner === "X" ? "#ef4444" : "#3b82f6",
                                fontWeight: "bold",
                                fontSize: "24px"
                            }}>{winner}</span> đã chiến thắng!
                        </p>

                        <div style={{
                            display: "flex",
                            gap: "12px",
                            justifyContent: "center"
                        }}>
                            <button
                                onClick={resetGame}
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
                                🔄 Chơi lại
                            </button>

                            <button
                                onClick={() => setWinner(null)}
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
                                👁️ Xem lại
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Thông tin lượt chơi */}
            <div style={{
                marginBottom: "16px",
                fontSize: "18px",
                fontWeight: "600",
                color: winner ? "#9ca3af" : (turn === "X" ? "#ef4444" : "#3b82f6")
            }}>
                {winner ? "Game đã kết thúc" : `Lượt của: ${turn}`}
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
                gap: "2px",
                backgroundColor: "#404040",
                padding: "12px",
                borderRadius: "16px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}>
                {board.map((row, r) =>
                    row.map((val, c) => {
                        const isWinning = isWinningPosition(r, c);
                        return (
                            <motion.button
                                key={`${r}-${c}`}
                                onClick={() => handleClick(r, c)}
                                disabled={!!winner}
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
                                    backgroundColor: winner ? "#1f2937" : "#262626",
                                    borderRadius: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: winner ? "not-allowed" : "pointer",
                                    border: "1px solid #525252",
                                    transition: "all 0.2s ease",
                                    padding: 0,
                                    outline: "none",
                                    opacity: winner && !isWinning ? 0.7 : 1,
                                    boxShadow: isWinning ? "0 0 8px rgba(251, 191, 36, 0.4)" : "none"
                                }}
                                onMouseEnter={(e) => {
                                    if (!winner && !isWinning) {
                                        e.currentTarget.style.backgroundColor = "#374151";
                                        e.currentTarget.style.boxShadow = "0 0 0 2px #06b6d4";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!winner && !isWinning) {
                                        e.currentTarget.style.backgroundColor = "#262626";
                                        e.currentTarget.style.boxShadow = "none";
                                    }
                                }}
                            >
                                {val && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        style={{
                                            fontSize: `${cellSize * 0.6}px`,
                                            fontWeight: "900",
                                            fontFamily: "monospace",
                                            color: val === "X" ? "#ef4444" : "#3b82f6",
                                            textShadow: isWinning ?
                                                (val === "X" ? "0 0 8px #ef4444, 0 0 16px #ef4444" : "0 0 8px #3b82f6, 0 0 16px #3b82f6") :
                                                (val === "X" ? "0 0 8px #ef4444" : "0 0 8px #3b82f6"),
                                            userSelect: "none",
                                            pointerEvents: "none"
                                        }}
                                    >
                                        {val}
                                    </motion.div>
                                )}
                            </motion.button>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default CaroBoard;
