import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IUser } from '@/features/auth';

interface IAppState {
    user: IUser | null
    authToken: string | null
    isAuthenticated: boolean
    
    isLoading: boolean
    error: string | null
    
    setUser: (user: IUser) => void
    setAuthToken: (token: string) => void
    logout: () => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    clearError: () => void
}

export const useAppStore = create<IAppState>()(
    persist(
        (set, _) => ({
            user: null,
            authToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            
            setUser: (user: IUser) => {
                set({ 
                    user, 
                    isAuthenticated: true,
                    error: null 
                })
            },
            
            setAuthToken: (token: string) => {
                set({ 
                    authToken: token,
                    isAuthenticated: true 
                })
            },
            
            logout: () => {
                set({ 
                    user: null, 
                    authToken: null, 
                    isAuthenticated: false,
                    error: null 
                })
                localStorage.removeItem('authToken')
                localStorage.removeItem('user')
            },
            
            setLoading: (isLoading: boolean) => {
                set({ isLoading })
            },
            
            setError: (error: string | null) => {
                set({ error, isLoading: false })
            },
            
            clearError: () => {
                set({ error: null })
            }
        }),
        {
            name: 'app-store',
            partialize: (state) => ({
                user: state.user,
                authToken: state.authToken,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
) 