export interface Conversation {
    id: number;

    user1_id: number;

    user2_id: number;

    created_at: string;

    updated_at: string;

    user1?: {
        id: number;
        username: string;
        avatar_url?: string;
    };

    user2?: {
        id: number;
        username: string;
        avatar_url?: string;
    };
}

export interface ConversationListResponse {
    conversations: Conversation[];
}