import api from "./api";

export interface DirectMessageCreate {

    content: string;

}

class DMService {

    async getConversations() {

        const response =
            await api.get(
                "/dms/conversations"
            );

        return response.data;

    }

    async createConversation(
        recipientId: number,
    ) {

        const response =
            await api.post(
                `/dms/conversations/${recipientId}`
            );

        return response.data;

    }

    async getConversation(
        conversationId: number,
    ) {

        const response =
            await api.get(
                `/dms/conversations/${conversationId}`
            );

        return response.data;

    }

    async getMessages(
        conversationId: number,
        page = 1,
        pageSize = 50,
    ) {

        const response =
            await api.get(
                `/dms/conversations/${conversationId}/messages`,
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
        conversationId: number,
        content: string,
    ) {

        const response =
            await api.post(
                `/dms/conversations/${conversationId}/messages`,
                {
                    content,
                }
            );

        return response.data;

    }

    async markMessageRead(
        messageId: number,
    ) {

        const response =
            await api.patch(
                `/dms/messages/${messageId}/read`
            );

        return response.data;

    }

    async deleteMessage(
        messageId: number,
    ) {

        await api.delete(
            `/dms/messages/${messageId}`
        );

    }

    async searchUsers(
        username: string,
    ) {

        const response =
            await api.get(
                "/users",
                {
                    params: {
                        username,
                    },
                }
            );

        return response.data;

    }

}

export default new DMService();