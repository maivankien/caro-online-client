import React from "react"
import WinModal from "@/components/caro/WinModal"
import BoardCell from "@/components/caro/BoardCell"
import { isPositionInWinningLine, type Player } from "@/utils/caroGameLogic"


export type { Player }

interface CaroBoardProps {
    size: number
    cellSize: number
    board: (Player | null)[][]
    currentPlayer: Player
    gameEnded: boolean
    winningPositions?: [number, number][]
    winner?: Player | null
    isCurrentUserWinner?: boolean
    winnerName?: string
    showWinModal?: boolean
    onMove?: (row: number, col: number, player: Player) => void
    onPlayAgain?: () => void
    onReview?: () => void
    onCloseModal?: () => void
    readOnly?: boolean
}

const CaroBoard: React.FC<CaroBoardProps> = ({
    size,
    cellSize,
    board,
    currentPlayer,
    gameEnded,
    winningPositions = [],
    winner = null,
    isCurrentUserWinner = false,
    winnerName,
    showWinModal = false,
    onMove,
    onPlayAgain,
    onReview,
    onCloseModal,
    readOnly = false
}) => {

    const handleClick = (r: number, c: number) => {
        if (readOnly || gameEnded || board[r][c]) {
            return
        }

        onMove?.(r, c, currentPlayer)
    }

    const handlePlayAgain = () => {
        onPlayAgain?.()
    }

    const handleReview = () => {
        onReview?.()
        onCloseModal?.()
    }

    const isWinningPosition = (row: number, col: number): boolean => {
        return isPositionInWinningLine(row, col, winningPositions)
    }

    return (
        <div style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            borderRadius: "12px",
            marginTop: "16px"
        }}>
            {winner !== null && showWinModal && (
                <WinModal
                    winner={winner}
                    isCurrentUserWinner={isCurrentUserWinner}
                    winnerName={winnerName}
                    onPlayAgain={handlePlayAgain}
                    onReview={handleReview}
                />
            )}

            <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
                gap: "2px",
                backgroundColor: "#ffffff",
                padding: "12px",
                borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb"
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
    )
}

export default CaroBoard
