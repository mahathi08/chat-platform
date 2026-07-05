import api from "./api";

class ServerService {
    async getServers() {
        const response = await api.get("/servers");
        return response.data;
    }

    async getServer(serverId: number) {
        const response = await api.get(`/servers/${serverId}`);
        return response.data;
    }

    async createServer(data: {
        name: string;
        description?: string;
        icon_url?: string;
    }) {
        const response = await api.post("/servers", data);
        return response.data;
    }

    async updateServer(
        serverId: number,
        data: {
            name?: string;
            description?: string;
            icon_url?: string;
        }
    ) {
        const response = await api.put(
            `/servers/${serverId}`,
            data
        );

        return response.data;
    }

    async deleteServer(serverId: number) {
        await api.delete(`/servers/${serverId}`);
    }

    async joinServer(serverId: number) {
        const response = await api.post(
            `/servers/${serverId}/join`
        );

        return response.data;
    }

    async leaveServer(serverId: number) {
        const response = await api.post(
            `/servers/${serverId}/leave`
        );

        return response.data;
    }
}

export default new ServerService();