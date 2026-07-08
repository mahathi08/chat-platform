export interface MessageAuthor {
    id: number;

    username: string;

    avatar_url?: string | null;

    status?: "ONLINE" | "OFFLINE" | "AWAY" | "DND";
}

export interface Message {
    id: number;

    channel_id: number;

    author_id: number;

    author: MessageAuthor;

    content: string;

    message_type:
        | "DEFAULT"
        | "SYSTEM"
        | "IMAGE"
        | "FILE";

    reply_to_id: number | null;

    is_edited: boolean;

    is_deleted: boolean;

    is_pinned: boolean;

    created_at: string;

    edited_at: string | null;
}

export interface MessageListResponse {
    messages: Message[];
}