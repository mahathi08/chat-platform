export type ChannelType =
    | "TEXT"
    | "VOICE"
    | "ANNOUNCEMENT";

export interface Channel {
    id: number;

    server_id: number;

    name: string;

    description?: string;

    topic?: string;

    type: ChannelType;

    position: number;

    is_private: boolean;

    created_at: string;

    updated_at?: string;
}

export interface ChannelCreate {
    name: string;

    description?: string;

    topic?: string;

    type?: ChannelType;

    position?: number;

    is_private?: boolean;
}

export interface ChannelUpdate {
    name?: string;

    description?: string;

    topic?: string;

    position?: number;

    is_private?: boolean;
}

export interface ChannelListResponse {
    channels: Channel[];
}