export type Player = "X" | "O";

/**
 * Kiểm tra điều kiện chiến thắng trong room Caro/Gomoku
 * @param board - Bàn cờ hiện tại (2D array)
 * @param lastMoveRow - Hàng của nước đi vừa thực hiện
 * @param lastMoveCol - Cột của nước đi vừa thực hiện
 * @param player - Người chơi vừa đi ("X" hoặc "O")
 * @param boardSize - Kích thước bàn cờ
 * @returns Mảng vị trí các ô tạo ra chiến thắng, hoặc null nếu chưa thắng
 */
export function checkWinCondition(
    board: (Player | null)[][],
    lastMoveRow: number,
    lastMoveCol: number,
    player: Player,
    boardSize: number
): [number, number][] | null {
    // 4 hướng kiểm tra: ngang, dọc, chéo chính (\), chéo phụ (/)
    const directions = [
        [0, 1],   // ngang (horizontal)
        [1, 0],   // dọc (vertical)
        [1, 1],   // chéo chính (diagonal \)
        [1, -1]   // chéo phụ (diagonal /)
    ];

    for (const [deltaRow, deltaCol] of directions) {
        const winningPositions: [number, number][] = [[lastMoveRow, lastMoveCol]];

        // Đếm các quân cờ liên tiếp về phía trước
        let currentRow = lastMoveRow + deltaRow;
        let currentCol = lastMoveCol + deltaCol;
        while (
            currentRow >= 0 &&
            currentRow < boardSize &&
            currentCol >= 0 &&
            currentCol < boardSize &&
            board[currentRow][currentCol] === player
        ) {
            winningPositions.push([currentRow, currentCol]);
            currentRow += deltaRow;
            currentCol += deltaCol;
        }

        // Đếm các quân cờ liên tiếp về phía sau
        currentRow = lastMoveRow - deltaRow;
        currentCol = lastMoveCol - deltaCol;
        while (
            currentRow >= 0 &&
            currentRow < boardSize &&
            currentCol >= 0 &&
            currentCol < boardSize &&
            board[currentRow][currentCol] === player
        ) {
            winningPositions.unshift([currentRow, currentCol]); // thêm vào đầu để giữ thứ tự
            currentRow -= deltaRow;
            currentCol -= deltaCol;
        }

        // Kiểm tra điều kiện thắng: 5 quân liên tiếp trở lên
        if (winningPositions.length >= 5) {
            return winningPositions;
        }
    }

    return null;
}

/**
 * Kiểm tra xem một vị trí có nằm trong danh sách các ô chiến thắng không
 * @param row - Hàng cần kiểm tra
 * @param col - Cột cần kiểm tra
 * @param winningPositions - Danh sách các vị trí chiến thắng
 * @returns true nếu vị trí là ô chiến thắng, false nếu không
 */
export function isPositionInWinningLine(
    row: number,
    col: number,
    winningPositions: [number, number][]
): boolean {
    return winningPositions.some(([winRow, winCol]) => winRow === row && winCol === col);
} 