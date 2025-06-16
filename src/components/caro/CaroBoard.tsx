import React, { useState } from "react";
import WinModal from "@/components/caro/WinModal";
import RoomInfo from "@/components/caro/GameInfo";
import BoardCell from "@/components/caro/BoardCell";
import { useTranslation } from "../../hooks/useTranslation";
import { checkWinCondition, isPositionInWinningLine, type Player } from "@/utils/caroGameLogic";

/**
 * Caro (Gomoku) board UI component – V4
 * ------------------------------------------------------
 * ✅ Luôn là hình vuông & căn giữa màn hình (flex‑center cả trục X/Y)
 * ✅ Hiển thị X màu đỏ (#ef4444 ‑ red‑500) & O màu xanh (#3b82f6 ‑ blue‑500)
 * ✅ Tránh bị lệch do khoảng cách (gap) giữa các ô: width & height = size*cell + (size‑1)*gap
 * ✅ Prop `gap` tùy chỉnh (mặc định 2px) – đổi đồng bộ width/height và style `gap`
 * ✅ Tách thành các component nhỏ để dễ quản lý
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

export type { Player };

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
    const [gameEnded, setRoomEnded] = useState<boolean>(false);
    const { t } = useTranslation();

    const handleClick = (r: number, c: number) => {
        // Ngăn hoàn toàn không cho đánh nếu room đã kết thúc
        if (gameEnded) {
            console.log(t('messages.gameAlreadyEnded'));
            return;
        }

        // Ngăn không cho đánh nếu ô đã có quân
        if (board[r][c]) {
            console.log(t('messages.cellOccupied'));
            return;
        }

        const next = board.map((row) => [...row]);
        next[r][c] = turn;
        setBoard(next);

        // Kiểm tra điều kiện chiến thắng
        const winPositions = checkWinCondition(next, r, c, turn, size);
        if (winPositions) {
            setWinner(turn);
            setWinningPositions(winPositions);
            setRoomEnded(true);
            console.log(t('room.playerWon', { player: turn }));
        }

        onMove?.(r, c, turn);
        setTurn((prev) => (prev === "X" ? "O" : "X"));
    };

    const resetRoom = () => {
        setBoard(Array.from({ length: size }, () => Array<Player | null>(size).fill(null)));
        setTurn("X");
        setWinner(null);
        setWinningPositions([]);
        setRoomEnded(false);
    };

    const handleReview = () => {
        setWinner(null);
    };

    // Kiểm tra xem ô có phải là ô chiến thắng không
    const isWinningPosition = (row: number, col: number): boolean => {
        return isPositionInWinningLine(row, col, winningPositions);
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
                <WinModal
                    winner={winner}
                    onPlayAgain={resetRoom}
                    onReview={handleReview}
                />
            )}

            {/* Thông tin lượt chơi */}
            <RoomInfo turn={turn} gameEnded={gameEnded} />

            {/* Bàn cờ */}
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
                    row.map((val, c) => (
                        <BoardCell
                            key={`${r}-${c}`}
                            value={val}
                            cellSize={cellSize}
                            isWinning={isWinningPosition(r, c)}
                            gameEnded={gameEnded}
                            onClick={() => handleClick(r, c)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default CaroBoard;
