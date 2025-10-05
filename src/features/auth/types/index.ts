export interface IUser {
    id: string
    name: string
    email?: string
    isGuest: boolean
    createdAt?: string
    updatedAt?: string
}

export interface IAuthData {
    user: IUser
    token: string
}

export interface IAuthResponse {
    data: IAuthData
    message: string
}

export interface ICreateGuestRequest {
    name: string
}

export interface IProfileData {
    name: string
    isGuest: number
    elo: number
    totalGames: number
    wins: number
    losses: number
}

export interface IProfileResponse {
    data: IProfileData
    message: string
}
