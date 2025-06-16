export interface IRoom {
    id: string
    name: string
    host: {
        id: string
        name: string
    }
    isPrivate: boolean
    hasPassword: boolean
    currentPlayers: number
    maxPlayers: number
    boardSize: number
    winCondition: number
    status: 'waiting' | 'playing' | 'finished'
    createdAt: string
}

export interface ICreateRoomRequest {
    name: string
    password?: string
    boardSize: number
    winCondition: number
    isPrivate?: boolean
}

export interface ICreateRoomResponse {
    data: IRoom
    message: string
}

export interface IRoomListResponse {
    data: {
        total: number
        page: number
        limit: number
        rooms: IRoom[]
    }
    message: string
}

export interface IJoinRoomRequest {
    roomId: string
    password?: string
}

export interface IJoinRoomResponse { }