import HomePage from '@/pages/HomePage'
import RoomPage from '@/pages/RoomPage'
import GamePage from '@/pages/GamePage'
import RoomLobbyPage from '@/pages/RoomLobbyPage'
import ProfilePage from '@/pages/ProfilePage'
import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RoomSocketProvider } from '@/sockets/context/RoomSocketProvider'

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
                            <RoomSocketProvider namespace="/room">
                                <RoomLobbyPage />
                            </RoomSocketProvider>
                        } 
                    />
                    <Route 
                        path="/game/:roomId" 
                        element={
                            <RoomSocketProvider namespace="/game">
                                <GamePage />
                            </RoomSocketProvider>
                        } 
                    />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>   
            </QueryClientProvider>
        </ErrorBoundary>
    )
}

export default Router 