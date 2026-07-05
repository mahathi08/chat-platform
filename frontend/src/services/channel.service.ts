import api from "./api";

export interface ChannelCreate {
    name: string;
    server_id: number;
    type: string;
    topic?: string;
}

export interface ChannelUpdate {
    name?: string;
    topic?: string;
}

class ChannelService {
    async createChannel(data: ChannelCreate) {
        const response = await api.post(
            "/channels",
            data
        );

        return response.data;
    }

    async getChannel(channelId: number) {
        const response = await api.get(
            `/channels/${channelId}`
        );

        return response.data;
    }

    async getServerChannels(serverId: number) {
        const response = await api.get(
            `/servers/${serverId}/channels`
        );

        return response.data;
    }

    async updateChannel(
        channelId: number,
        data: ChannelUpdate
    ) {
        const response = await api.put(
            `/channels/${channelId}`,
            data
        );

        return response.data;
    }

    async deleteChannel(channelId: number) {
        await api.delete(
            `/channels/${channelId}`
        );
    }

    async joinChannel(channelId: number) {
        const response = await api.post(
            `/channels/${channelId}/join`
        );

        return response.data;
    }

    async leaveChannel(channelId: number) {
        const response = await api.post(
            `/channels/${channelId}/leave`
        );

        return response.data;
    }
}

export default new ChannelService();