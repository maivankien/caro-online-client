import "@/styles/pages/GamePage.css"
import "@/styles/components/GamePlayerInfo.css"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { roomApi } from "@/features/room"
import AppHeader from "@/components/AppHeader"
import { useTranslation } from "@/hooks/useTranslation"
import { EVENT_SOCKET_CONSTANTS } from "@/constants/socket.constants"
import { useAuth } from "@/features/auth"
import GamePlayerInfo from "@/components/caro/GamePlayerInfo"
import { createGamePlayerInfo } from "@/utils/gameHelpers"
import CaroBoard from "@/components/caro/CaroBoard"
import { type Player } from "@/utils/caroGameLogic"
import { toastManager } from "@/contexts/ToastContext"
import {
    useGameSocket, type IGameStartedData, type IGamePlayerInfo,
    type IMakeMoveDto, type IGameMovePayload, type IGameFinishedPayload
} from "@/features/game"


const GamePage = () => {
    const { t } = useTranslation()
    const { roomId } = useParams<{ roomId: string }>()
    const { user } = useAuth()
    const [countdown, setCountdown] = useState<number | null>(null)
    const [isGameStarting, setIsGameStarting] = useState(false)
    const [gameData, setGameData] = useState<IGameStartedData | null>(null)
    const [playerX, setPlayerX] = useState<IGamePlayerInfo | null>(null)
    const [playerO, setPlayerO] = useState<IGamePlayerInfo | null>(null)
    const [currentBoard, setCurrentBoard] = useState<(Player | null)[][]>([])
    const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
    const [isGameActive, setIsGameActive] = useState<boolean>(false)
    const [winner, setWinner] = useState<Player | null>(null)
    const [winningPositions, setWinningPositions] = useState<[number, number][]>([])
    const [isCurrentUserWinner, setIsCurrentUserWinner] = useState<boolean>(false)
    const [winnerName, setWinnerName] = useState<string>('')
    const [showWinModal, setShowWinModal] = useState<boolean>(false)
    const [showPlayAgainButton, setShowPlayAgainButton] = useState<boolean>(false)

    const { connected, connecting, emit, on } = useGameSocket()

    const { data: room } = useQuery({
        queryKey: ['room', roomId],
        queryFn: () => roomApi.getRoomDetail(roomId)
    })

    const getCellSize = (boardSize: number): number => {
        if (boardSize >= 19) {
            return 32
        }
        if (boardSize >= 15) {
            return 36
        }
        return 40
    }

    const getBoardConfig = () => {
        const boardSize = room?.data?.boardSize ?? 15
        return { boardSize, cellSize: getCellSize(boardSize) }
    }

    const { boardSize, cellSize } = getBoardConfig()

    const handlePlayerMove = (row: number, col: number, player: Player) => {
        if (!user || !gameData || currentBoard[row]?.[col] !== null) {
            return
        }

        if (!isGameActive) {
            toastManager.showToast('error', 'Trò chơi đã kết thúc!')
            return
        }

        const isPlayerX = gameData.players.playerXId === user.id
        const expectedPlayer = isPlayerX ? 'X' : 'O'

        if (currentPlayer !== expectedPlayer) {
            toastManager.showToast('error', 'Không phải lượt của bạn!')
            return
        }

        const moveData: IMakeMoveDto = { row, col }
        emit(EVENT_SOCKET_CONSTANTS.MAKE_MOVE, moveData)
    }

    const handlePlayAgain = () => {
        setShowWinModal(false)
        setShowPlayAgainButton(false)
        console.log('handlePlayAgain')
    }

    useEffect(() => {
        if (connected && roomId) {
            emit(EVENT_SOCKET_CONSTANTS.PLAYER_READY)
        }
    }, [connected, roomId, emit])

    useEffect(() => {
        if (!connected) {
            return
        }

        const unsubscribeMove = on(EVENT_SOCKET_CONSTANTS.GAME_MOVE_MADE, (movePayload: IGameMovePayload) => {
            const { gameState } = movePayload
            setCurrentBoard(gameState.board)
            setCurrentPlayer(gameState.currentPlayer)
            setIsGameActive(gameState.isGameActive)

            if (gameData && user) {
                const updatedGameData: IGameStartedData = {
                    players: gameData.players,
                    gameState: gameState,
                    message: gameData.message
                }

                const { playerX: pX, playerO: pO } = createGamePlayerInfo(updatedGameData, user)
                setPlayerX(pX)
                setPlayerO(pO)
            }
        })

        const unsubscribeGameStartCountdown = on(EVENT_SOCKET_CONSTANTS.GAME_START_COUNTDOWN, (data) => {
            setIsGameStarting(true)
            setCountdown(data.countdown)
        })

        const unsubscribeGameFinished = on(EVENT_SOCKET_CONSTANTS.GAME_FINISHED, (gameResult: IGameFinishedPayload) => {
            const { gameState, winner, winningLine } = gameResult

            setCurrentBoard(gameState.board)
            setCurrentPlayer(gameState.currentPlayer)
            setIsGameActive(gameState.isGameActive)

            setWinner(winner)
            setShowWinModal(true)
            setShowPlayAgainButton(true)

            const winPositions: [number, number][] = winningLine.map(pos => [pos.row, pos.col])
            setWinningPositions(winPositions)

            if (winner && user && gameData?.players) {
                const { playerXId, playerOId } = gameData.players
                const winnerPlayerId = winner === 'X' ? playerXId : playerOId

                const isWinner = winnerPlayerId === user.id
                setIsCurrentUserWinner(isWinner)

                if (isWinner) {
                    setWinnerName('Bạn')
                } else {
                    const winnerPlayerInfo = winner === 'X' ? playerX : playerO
                    setWinnerName(winnerPlayerInfo?.playerName || `Người chơi ${winner}`)
                }
            } else {
                setWinnerName('')
                setIsCurrentUserWinner(false)
            }
        })

        const unsubscribeGameStart = on(EVENT_SOCKET_CONSTANTS.GAME_STARTED, (data: IGameStartedData) => {
            setCountdown(null)
            setGameData(data)
            setIsGameStarting(false)

            setCurrentBoard(data.gameState.board)
            setCurrentPlayer(data.gameState.currentPlayer)
            setIsGameActive(data.gameState.isGameActive)

            const { playerX: pX, playerO: pO } = createGamePlayerInfo(data, user)
            setPlayerX(pX)
            setPlayerO(pO)
        })

        return () => {
            unsubscribeMove()
            unsubscribeGameFinished()
            unsubscribeGameStartCountdown()
            unsubscribeGameStart()
        }
    }, [connected, on, gameData, user])

    if (connecting) {
        return (
            <div className="game-loading-container">
                <AppHeader title={t('game.title')} />
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Đang kết nối game...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="game-page-container">
            <AppHeader title={t('game.title')} />
            <div>
                {gameData && (playerX || playerO) && (
                    <GamePlayerInfo
                        playerX={playerX}
                        playerO={playerO}
                        currentPlayer={currentPlayer}
                        gameActive={isGameActive}
                        compact={true}
                        showGameStatus={false}
                    />
                )}

                {showPlayAgainButton && (
                    <div className="play-again-container">
                        <button 
                            className="play-again-btn"
                            onClick={handlePlayAgain}
                        >
                            🔄 Chơi lại
                        </button>
                    </div>
                )}

                {isGameStarting && countdown !== null && (
                    <div className="game-countdown-overlay">
                        <div className="countdown-container">
                            <h2>Game sắp bắt đầu!</h2>
                            <div className="countdown-number">
                                {countdown}
                            </div>
                        </div>
                    </div>
                )}

                {gameData && currentBoard.length > 0 && (
                    <CaroBoard
                        size={boardSize}
                        cellSize={cellSize}
                        board={currentBoard}
                        currentPlayer={currentPlayer}
                        gameEnded={!isGameActive}
                        winningPositions={winningPositions}
                        winner={winner}
                        isCurrentUserWinner={isCurrentUserWinner}
                        winnerName={winnerName}
                        showWinModal={showWinModal}
                        onMove={handlePlayerMove}
                        onPlayAgain={handlePlayAgain}
                        onCloseModal={() => setShowWinModal(false)}
                        onReview={() => setShowWinModal(false)}
                        readOnly={false}
                    />
                )}
            </div>
        </div>
    )
}

export default GamePage
