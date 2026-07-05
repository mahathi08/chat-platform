import api from "./api";

class MessageService {

    async getMessages(
        channelId: number,
        page = 1,
        pageSize = 25,
    ) {

        const response = await api.get(
            `/messages/channels/${channelId}`,
            {
                params: {
                    page,
                    page_size: pageSize,
                },
            }
        );

        return response.data;
    }

    async sendMessage(
        channelId: number,
        content: string,
    ) {

        const response = await api.post(
            `/messages/channels/${channelId}`,
            {
                content,
            }
        );

        return response.data;
    }

    async editMessage(
        messageId: number,
        content: string,
    ) {

        const response = await api.patch(
            `/messages/${messageId}`,
            {
                content,
            }
        );

        return response.data;
    }

    async deleteMessage(
        messageId: number,
    ) {

        await api.delete(
            `/messages/${messageId}`
        );

    }

    async pinMessage(
        messageId: number,
    ) {

        const response = await api.patch(
            `/messages/${messageId}/pin`
        );

        return response.data;
    }

    async unpinMessage(
        messageId: number,
    ) {

        const response = await api.patch(
            `/messages/${messageId}/unpin`
        );

        return response.data;
    }
}

export default new MessageService();