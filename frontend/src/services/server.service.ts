import api from "./api";

import type {
    Server,
    ServerCreate,
    ServerUpdate,
    ServerListResponse,
} from "../types/server";

class ServerService {
    async getServers(): Promise<ServerListResponse> {
        const response =
            await api.get<ServerListResponse>(
                "/servers"
            );

        return response.data;
    }

    async getServer(
        serverId: number
    ): Promise<Server> {
        const response =
            await api.get<Server>(
                `/servers/${serverId}`
            );

        return response.data;
    }

    async createServer(
        data: ServerCreate
    ): Promise<Server> {
        const response =
            await api.post<Server>(
                "/servers",
                data
            );

        return response.data;
    }

    async updateServer(
        serverId: number,
        data: ServerUpdate
    ): Promise<Server> {
        const response =
            await api.put<Server>(
                `/servers/${serverId}`,
                data
            );

        return response.data;
    }

    async deleteServer(
        serverId: number
    ): Promise<void> {
        await api.delete(
            `/servers/${serverId}`
        );
    }

    async joinServer(
        serverId: number
    ): Promise<{ message: string }> {
        const response =
            await api.post<{
                message: string;
            }>(
                `/servers/${serverId}/join`
            );

        return response.data;
    }

    async leaveServer(
        serverId: number
    ): Promise<{ message: string }> {
        const response =
            await api.post<{
                message: string;
            }>(
                `/servers/${serverId}/leave`
            );

        return response.data;
    }

    async getMembers(
        serverId: number
    ) {
        const response =
            await api.get(
                `/servers/${serverId}/members`
            );

        return response.data;
    }

    async transferOwnership(
        serverId: number,
        newOwnerId: number
    ): Promise<Server> {
        const response =
            await api.patch<Server>(
                `/servers/${serverId}/transfer`,
                {
                    new_owner_id:
                        newOwnerId,
                }
            );

        return response.data;
    }

    async kickMember(
        serverId: number,
        userId: number
    ): Promise<{ message: string }> {
        const response =
            await api.delete<{
                message: string;
            }>(
                `/servers/${serverId}/members/${userId}`
            );

        return response.data;
    }
}

export default new ServerService();