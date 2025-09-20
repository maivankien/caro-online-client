export const ROOM_STATUS_CONSTANTS = {
    WAITING: 'waiting',           // Chờ player thứ 2 join
    WAITING_READY: 'waiting_ready', // Cả 2 players đã join, chờ ready
    COUNTDOWN: 'countdown',       // Đang countdown 3-2-1
    PLAYING: 'playing',           // Game đang diễn ra
    FINISHED: 'finished',         // Game kết thúc
} as const

export type RoomStatus = typeof ROOM_STATUS_CONSTANTS[keyof typeof ROOM_STATUS_CONSTANTS]
