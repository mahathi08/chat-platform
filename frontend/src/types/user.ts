export type UserStatus =
    | "ONLINE"
    | "OFFLINE"
    | "AWAY"
    | "BUSY";

export interface UserResponse {
    id: number;
    username: string;
    email: string;
    avatar_url: string | null;
    bio: string | null;
    status: UserStatus;
    last_seen: string | null;
    created_at: string;
}

export interface UserProfile {
    id: number;
    username: string;
    avatar_url: string | null;
    bio: string | null;
    status: UserStatus;
    last_seen: string | null;
}

export interface UserUpdate {
    username?: string;
    bio?: string;
    avatar_url?: string;
}

export interface UserStatusUpdate {
    status: UserStatus;
}