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
    type IMakeMoveDto, type IGameMovePayload, type IGameFinishedPayload,
    type IGameCountdownPayload, type IGameStateSyncPayload,
    type IGameState, type IWinningPosition, type IGamePlayers,
    type IRematchRequestPayload
} from "@/features/game"
import { ROOM_STATUS_CONSTANTS } from "@/constants/room.constants"


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
    const [showRematchRequest, setShowRematchRequest] = useState<boolean>(false)
    const [rematchRequestFrom, setRematchRequestFrom] = useState<string>('')
    const [lastMovePosition, setLastMovePosition] = useState<IMakeMoveDto | undefined>(undefined)

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
            toastManager.showToast('error', t('gamePage.gameEnded'))
            return
        }

        const isPlayerX = gameData.players.playerXId === user.id
        const expectedPlayer = isPlayerX ? 'X' : 'O'

        if (currentPlayer !== expectedPlayer) {
            toastManager.showToast('error', t('gamePage.notYourTurn'))
            return
        }

        const moveData: IMakeMoveDto = { row, col }
        emit(EVENT_SOCKET_CONSTANTS.MAKE_MOVE, moveData)
    }

    const handlePlayAgain = () => {
        setShowWinModal(false)
        setShowPlayAgainButton(false)
        emit(EVENT_SOCKET_CONSTANTS.REQUEST_REMATCH)
    }

    const handleAcceptRematch = () => {
        setShowRematchRequest(false)
        emit(EVENT_SOCKET_CONSTANTS.ACCEPT_REMATCH)
    }

    const handleDeclineRematch = () => {
        setShowRematchRequest(false)
        emit(EVENT_SOCKET_CONSTANTS.DECLINE_REMATCH)
    }

    useEffect(() => {
        if (!connected) {
            return
        }

        const status = room?.data?.status
        if (status === ROOM_STATUS_CONSTANTS.WAITING_READY) {
            emit(EVENT_SOCKET_CONSTANTS.PLAYER_READY)
        }

        if (status === ROOM_STATUS_CONSTANTS.PLAYING) {
            emit(EVENT_SOCKET_CONSTANTS.GET_GAME_STATE)
        }
    }, [connected, emit])

    const setPlayerInfo = (data: IGameStartedData | IGameStateSyncPayload) => {
        const { playerX: pX, playerO: pO } = createGamePlayerInfo(data, user, t)
        setPlayerX(pX)
        setPlayerO(pO)
    }

    const updateGameState = (gameState: IGameState) => {
        setCurrentBoard(gameState.board)
        setCurrentPlayer(gameState.currentPlayer)
        setIsGameActive(gameState.isGameActive)
        setLastMovePosition(gameState.lastMovePosition)
    }

    const handleGameFinished = (winner: Player | null, players: IGamePlayers, winningLine?: IWinningPosition[]) => {
        setWinner(winner)
        setShowWinModal(true)
        setShowPlayAgainButton(true)

        if (winningLine && winningLine.length > 0) {
            const winPositions: [number, number][] = winningLine.map(pos => [pos.row, pos.col])
            setWinningPositions(winPositions)
        }

        if (winner && user) {
            const { playerXId, playerOId } = players
            const winnerPlayerId = winner === 'X' ? playerXId : playerOId
            const isWinner = winnerPlayerId === user.id
            setIsCurrentUserWinner(isWinner)

            if (isWinner) {
                setWinnerName(t('gamePage.you'))
            } else {
                const winnerPlayerInfo = winner === 'X' ? playerX : playerO
                setWinnerName(winnerPlayerInfo?.playerName || `${t('gamePage.player')} ${winner}`)
            }
        } else {
            setWinnerName('')
            setIsCurrentUserWinner(false)
        }
    }

    useEffect(() => {
        if (!connected) {
            return
        }

        const unsubscribeMove = on(EVENT_SOCKET_CONSTANTS.GAME_MOVE_MADE, (movePayload: IGameMovePayload) => {
            const { gameState } = movePayload
            updateGameState(gameState)

            if (gameData && user) {
                const updatedGameData: IGameStartedData = {
                    players: gameData.players,
                    gameState: gameState,
                }

                setPlayerInfo(updatedGameData)
            }
        })

        const unsubscribeGameStartCountdown = on(EVENT_SOCKET_CONSTANTS.GAME_START_COUNTDOWN, (data: IGameCountdownPayload) => {
            setIsGameStarting(true)
            setCountdown(data.countdown)
        })

        const unsubscribeGameFinished = on(EVENT_SOCKET_CONSTANTS.GAME_FINISHED, (gameResult: IGameFinishedPayload) => {
            const { gameState, winner, winningLine } = gameResult

            updateGameState(gameState)

            if (gameData?.players) {
                handleGameFinished(winner, gameData.players, winningLine)
            }
        })

        const unsubscribeGameStart = on(EVENT_SOCKET_CONSTANTS.GAME_STARTED, (data: IGameStartedData) => {
            setCountdown(null)
            setGameData(data)
            setIsGameStarting(false)

            setWinner(null)
            setWinnerName('')
            setIsCurrentUserWinner(false)
            setWinningPositions([])
            setRematchRequestFrom('')
            setShowRematchRequest(false)
            setShowPlayAgainButton(false)
            setShowWinModal(false)

            setPlayerInfo(data)
            updateGameState(data.gameState)
        })

        const unsubscribeGameStateSync = on(EVENT_SOCKET_CONSTANTS.GAME_STATE_SYNC, (data: IGameStateSyncPayload) => {
            const { gameState, players, winner, winningLine } = data

            const syncGameData: IGameStartedData = {
                gameState,
                players,
            }

            setGameData(syncGameData)
            updateGameState(gameState)
            setPlayerInfo(syncGameData)

            if (!gameState.isGameActive && winner !== undefined) {
                handleGameFinished(winner, players, winningLine)
            }
        })

        const unsubscribeRematchRequest = on(EVENT_SOCKET_CONSTANTS.REQUEST_REMATCH, (data: IRematchRequestPayload) => {
            if (data.userId === user?.id) {
                return
            }

            setShowRematchRequest(true)
            setRematchRequestFrom(data.name)
        })

        const unsubscribeRematchResponse = on(EVENT_SOCKET_CONSTANTS.ACCEPT_REMATCH, (data: IRematchRequestPayload) => {
            if (data.userId === user?.id) {
                return
            }

            toastManager.showToast('success', t('gamePage.rematchAccepted'))
        })

        const unsubscribeRematchDecline = on(EVENT_SOCKET_CONSTANTS.DECLINE_REMATCH, (data: IRematchRequestPayload) => {
            if (data.userId === user?.id) {
                return
            }

            setShowRematchRequest(false)
            toastManager.showToast('info', t('gamePage.rematchRejected'))
        })

        return () => {
            unsubscribeMove()
            unsubscribeGameStart()
            unsubscribeGameFinished()
            unsubscribeGameStateSync()
            unsubscribeGameStartCountdown()
            unsubscribeRematchRequest()
            unsubscribeRematchResponse()
            unsubscribeRematchDecline()
        }
    }, [connected, on, gameData, user])

    if (connecting) {
        return (
            <div className="game-loading-container">
                <AppHeader title={t('game.title')} />
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>{t('gamePage.connecting')}</p>
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
                            {t('gamePage.playAgain')}
                        </button>
                    </div>
                )}

                {showRematchRequest && (
                    <div className="rematch-request-overlay">
                        <div className="rematch-request-container">
                            <h3>{t('gamePage.rematchRequest')}</h3>
                            <p>{rematchRequestFrom} {t('gamePage.wantsToRematch')}</p>
                            <div className="rematch-buttons">
                                <button
                                    className="accept-rematch-btn"
                                    onClick={handleAcceptRematch}
                                >
                                    {t('gamePage.accept')}
                                </button>
                                <button
                                    className="decline-rematch-btn"
                                    onClick={handleDeclineRematch}
                                >
                                    {t('gamePage.decline')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isGameStarting && countdown !== null && (
                    <div className="game-countdown-overlay">
                        <div className="countdown-container">
                            <h2>{t('gamePage.gameStarting')}</h2>
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
                        lastMovePosition={lastMovePosition}
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
