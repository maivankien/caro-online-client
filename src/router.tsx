import HomePage from '@/pages/HomePage'
import RoomPage from '@/pages/RoomPage'
import GamePage from '@/pages/GamePage'
import RoomLobbyPage from '@/pages/RoomLobbyPage'
import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SocketProvider } from '@/sockets/context/SocketProvider'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false
        }
    }
})

const Router = () => {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/room" element={<RoomPage />} />
                    <Route 
                        path="/room/:roomId" 
                        element={
                            <SocketProvider namespace="/room">
                                <RoomLobbyPage />
                            </SocketProvider>
                        } 
                    />
                    <Route 
                        path="/game/:roomId" 
                        element={
                            <SocketProvider namespace="/game">
                                <GamePage />
                            </SocketProvider>
                        } 
                    />
                </Routes>   
            </QueryClientProvider>
        </ErrorBoundary>
    )
}

export default Router 