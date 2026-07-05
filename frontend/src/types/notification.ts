export type NotificationType =
    | "MESSAGE"
    | "MENTION"
    | "INVITE"
    | "SYSTEM";

export interface NotificationResponse {
    id: number;
    user_id: number;
    title: string;
    message: string;
    notification_type: NotificationType;
    is_read: boolean;
    created_at: string;
    read_at: string | null;
}

export interface NotificationUpdate {
    is_read: boolean;
}

export interface NotificationListResponse {
    notifications: NotificationResponse[];
}