import api from "./api";

export interface UserUpdate {
    username?: string;
    display_name?: string;
    bio?: string;
    avatar_url?: string;
}

export interface UserStatusUpdate {
    status: string;
}

class UserService {
    async getCurrentUser() {
        const response = await api.get("/users/me");
        return response.data;
    }

    async getUserProfile(userId: number) {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    }

    async updateProfile(data: UserUpdate) {
        const response = await api.put("/users/me", data);
        return response.data;
    }

    async updateStatus(data: UserStatusUpdate) {
        const response = await api.patch(
            "/users/me/status",
            data
        );

        return response.data;
    }

    async searchUsers(username: string) {
        const response = await api.get("/users", {
            params: {
                username,
            },
        });

        return response.data;
    }

    async deleteAccount() {
        await api.delete("/users/me");
    }
}

export default new UserService();