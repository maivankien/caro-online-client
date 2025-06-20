export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
    WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL ?? 'ws://localhost:3000',
    TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT ?? '10000'),
    HEADERS: {
        'Content-Type': 'application/json',
    },
} as const


export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH_GUEST: '/api/auth/guest',
    AUTH_LOGOUT: '/api/auth/logout',
    AUTH_PROFILE: '/api/auth/profile',

    // Room endpoints
    ROOM_LIST: '/api/rooms',
    ROOM_CREATE: '/api/rooms',
    ROOM_JOIN: '/api/rooms/join',
} as const

