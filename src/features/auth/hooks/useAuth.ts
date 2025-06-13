import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { authApi } from '../services/authApi';
import type { ICreateGuestRequest } from '../types';

export const useAuth = () => {
    const navigate = useNavigate()
    const {
        user,
        setUser,
        setAuthToken,
        isAuthenticated,
        logout: storeLogout,
    } = useAppStore()


    const createGuest = useCallback(async (data: ICreateGuestRequest) => {
        const response = await authApi.createGuest(data)
        setUser(response.data.user)
        setAuthToken(response.data.token)
    }, [])

    const logout = useCallback(async () => {
        try {
            await authApi.logout()
        } catch (error) {
            console.error('Logout API call failed:', error)
        } finally {
            storeLogout()
            navigate('/')
        }
    }, [storeLogout, navigate])

    const verifyToken = useCallback(async () => {
        try {
            const response = await authApi.verifyToken()
            if (response.data) {
                setUser(response.data.user)
                setAuthToken(response.data.token)
                return true
            }
            return false
        } catch (error) {
            console.error('Token verification failed:', error)
            storeLogout()
            return false
        }
    }, [setUser, setAuthToken, storeLogout])

    return {
        user,
        isAuthenticated,
        createGuest,
        logout,
        verifyToken
    }
} 