export interface Message {
    id: number;

    content: string;

    channel_id: number;

    author_id: number;

    created_at: string;

    updated_at?: string;

    pinned?: boolean;

    author?: {
        id: number;
        username: string;
        avatar_url?: string;
    };
}

export interface MessageListResponse {
    messages: Message[];

    total: number;

    page: number;

    page_size: number;
}