import api from "./api";

import type { User } from "../types/user";

import {
    saveAccessToken,
    saveRefreshToken,
    saveUser,
    logoutStorage,
} from "../utils/storage";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface ChangePasswordRequest {
    old_password: string;
    new_password: string;
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

class AuthService {
    async login(
        credentials: LoginRequest
    ): Promise<User> {
        const response =
            await api.post<TokenResponse>(
                "/auth/login",
                credentials
            );

        const tokens = response.data;

        saveAccessToken(
            tokens.access_token
        );

        saveRefreshToken(
            tokens.refresh_token
        );

        const me =
            await this.getCurrentUser();

        saveUser(me);

        return me;
    }

    async oauthLogin(
        username: string,
        password: string
    ): Promise<User> {
        const form =
            new URLSearchParams();

        form.append(
            "username",
            username
        );

        form.append(
            "password",
            password
        );

        const response =
            await api.post<TokenResponse>(
                "/auth/token",
                form,
                {
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded",
                    },
                }
            );

        saveAccessToken(
            response.data.access_token
        );

        saveRefreshToken(
            response.data.refresh_token
        );

        const me =
            await this.getCurrentUser();

        saveUser(me);

        return me;
    }

    async register(
        data: RegisterRequest
    ): Promise<User> {
        await api.post(
            "/auth/register",
            data
        );

        return this.login({
            email: data.email,
            password: data.password,
        });
    }

    async getCurrentUser(): Promise<User> {
        const response =
            await api.get<User>(
                "/auth/me"
            );

        return response.data;
    }

    async refreshToken(
        refreshToken: string
    ): Promise<TokenResponse> {
        const response =
            await api.post<TokenResponse>(
                "/auth/refresh",
                {
                    refresh_token:
                        refreshToken,
                }
            );

        saveAccessToken(
            response.data.access_token
        );

        saveRefreshToken(
            response.data.refresh_token
        );

        return response.data;
    }

    async changePassword(
        data: ChangePasswordRequest
    ) {
        const response =
            await api.post(
                "/auth/change-password",
                data
            );

        return response.data;
    }

    async logout(): Promise<void> {
        logoutStorage();
    }
}

export default new AuthService();