export interface DirectMessage {
    id: number;

    conversation_id: number;

    sender_id: number;

    content: string;

    is_read: boolean;

    is_deleted: boolean;

    is_edited: boolean;

    created_at: string;

    edited_at?: string;
}

export interface DirectMessageCreate {
    content: string;
}

export interface DirectMessageUpdate {
    content: string;
}

export interface DirectMessageListResponse {
    messages: DirectMessage[];
}