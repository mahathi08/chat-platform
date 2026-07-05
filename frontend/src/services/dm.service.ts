import api from "./api";

export interface DMCreate {
    receiver_id: number;
    content: string;
    attachments?: string[];
}

export interface DMUpdate {
    content: string;
}

class DMService {
    async getConversations() {
        const response = await api.get("/dms");

        return response.data;
    }

    async getConversation(userId: number) {
        const response = await api.get(
            `/dms/${userId}`
        );

        return response.data;
    }

    async sendMessage(data: DMCreate) {
        const response = await api.post(
            "/dms",
            data
        );

        return response.data;
    }

    async editMessage(
        messageId: number,
        data: DMUpdate
    ) {
        const response = await api.put(
            `/dms/messages/${messageId}`,
            data
        );

        return response.data;
    }

    async deleteMessage(messageId: number) {
        await api.delete(
            `/dms/messages/${messageId}`
        );
    }

    async markConversationRead(userId: number) {
        const response = await api.post(
            `/dms/${userId}/read`
        );

        return response.data;
    }

    async searchUsers(query: string) {
        const response = await api.get(
            "/users",
            {
                params: {
                    username: query,
                },
            }
        );

        return response.data;
    }
}

export default new DMService();