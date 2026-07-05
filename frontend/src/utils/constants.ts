// API

export const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000/api/v1";

// WebSocket

export const WS_URL =
    import.meta.env.VITE_WS_URL ||
    "ws://localhost:8000/ws";

// Storage Keys

export const STORAGE_KEYS = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    USER: "user",
    THEME: "theme",
};

// Pagination

export const DEFAULT_PAGE_SIZE = 25;

// Upload

export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

// Application

export const APP_NAME = "Real-Time Chat Platform";

export const APP_VERSION = "1.0.0";

// Message Types

export const MESSAGE_TYPES = {
    TEXT: "text",
    IMAGE: "image",
    FILE: "file",
};

// User Status

export const USER_STATUS = {
    ONLINE: "online",
    OFFLINE: "offline",
    AWAY: "away",
    DND: "dnd",
};