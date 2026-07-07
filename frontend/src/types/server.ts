import type { Channel } from "./channel";
import type { User } from "./user";

export interface Server {
    id: number;

    name: string;

    description?: string;

    icon_url?: string;

    owner_id: number;

    owner?: User;

    channels?: Channel[];

    member_count?: number;

    created_at: string;

    updated_at?: string;
}

export interface ServerCreate {
    name: string;

    description?: string;

    icon_url?: string;
}

export interface ServerUpdate {
    name?: string;

    description?: string;

    icon_url?: string;
}

export interface ServerListResponse {
    servers: Server[];
}