export interface WebSocketEvent<T = any> {
    type: string;
    payload: T;
}

export interface ChatMessagePayload {
    channel_id: number;
    content: string;
}

export interface TypingPayload {
    channel_id: number;
    user_id: number;
}

export interface PresencePayload {
    user_id: number;
    status: string;
}

export interface NotificationPayload {
    notification_id: number;
}