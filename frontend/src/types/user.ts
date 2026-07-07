export type UserStatus =
    | "ONLINE"
    | "OFFLINE"
    | "AWAY"
    | "BUSY";

export interface User {
    id: number;

    username: string;

    email: string;

    avatar_url?: string;

    bio?: string;

    status: UserStatus;

    last_seen?: string;

    created_at: string;

    updated_at?: string;
}

export interface UserProfile {
    id: number;

    username: string;

    avatar_url?: string;

    bio?: string;

    status: UserStatus;

    last_seen?: string;
}

export interface UserUpdate {
    username?: string;

    bio?: string;

    avatar_url?: string;
}

export interface UserStatusUpdate {
    status: UserStatus;
}

export interface UserListResponse {
    users: User[];
}