export interface Server {
    id: number;

    name: string;

    description?: string;

    icon_url?: string;

    owner_id: number;

    created_at: string;
}

export interface ServerListResponse {
    servers: Server[];
}