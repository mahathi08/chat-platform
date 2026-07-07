import api from "./api";

import type {
    ChannelCreate,
    ChannelUpdate,
} from "../types/channel";

class ChannelService {

    async createChannel(
        serverId: number,
        data: ChannelCreate,
    ) {

        const response = await api.post(
            `/channels/servers/${serverId}`,
            data,
        );

        return response.data;
    }

    async getServerChannels(
        serverId: number,
    ) {

        const response = await api.get(
            `/channels/servers/${serverId}`,
        );

        return response.data;
    }

    async getChannel(
        channelId: number,
    ) {

        const response = await api.get(
            `/channels/${channelId}`,
        );

        return response.data;
    }

    async updateChannel(
        channelId: number,
        data: ChannelUpdate,
    ) {

        const response = await api.put(
            `/channels/${channelId}`,
            data,
        );

        return response.data;
    }

    async deleteChannel(
        channelId: number,
    ) {

        await api.delete(
            `/channels/${channelId}`,
        );

    }

}

export default new ChannelService();