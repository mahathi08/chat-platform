import { STORAGE_KEYS } from "./constants";

/**
 * Generic helpers
 */

export const setItem = <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const getItem = <T>(key: string): T | null => {
    const value = localStorage.getItem(key);

    if (!value) return null;

    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
};

export const removeItem = (key: string): void => {
    localStorage.removeItem(key);
};

export const clearStorage = (): void => {
    localStorage.clear();
};

/**
 * Access Token
 */

export const saveAccessToken = (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

export const getAccessToken = (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const removeAccessToken = (): void => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Refresh Token
 */

export const saveRefreshToken = (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const removeRefreshToken = (): void => {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * User
 */

export const saveUser = <T>(user: T): void => {
    setItem(STORAGE_KEYS.USER, user);
};

export const getUser = <T>(): T |null => {
    return getItem<T>(STORAGE_KEYS.USER);
};

export const removeUser = (): void => {
    removeItem(STORAGE_KEYS.USER);
};

/**
 * Theme
 */

export const saveTheme = (theme: string): void => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
};

export const getTheme = (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.THEME);
};

/**
 * Logout
 */

export const logoutStorage = (): void => {
    removeAccessToken();
    removeRefreshToken();
    removeUser();
};