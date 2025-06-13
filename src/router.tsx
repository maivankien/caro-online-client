import HomePage from '@/pages/HomePage'
import GamePage from '@/pages/GamePage'
import { Routes, Route } from 'react-router-dom'
import CaroBoard from '@/components/caro/CaroBoard'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


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
                    <Route path="/game" element={<GamePage />} />
                    <Route path="/caro" element={<CaroBoard />} />
                </Routes>
            </QueryClientProvider>
        </ErrorBoundary>
    )
}

export default Router 