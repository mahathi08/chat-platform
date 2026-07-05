import api from "./api";

class NotificationService {
    async getNotifications(
        page: number = 1,
        limit: number = 20
    ) {
        const response = await api.get(
            "/notifications",
            {
                params: {
                    page,
                    limit,
                },
            }
        );

        return response.data;
    }

    async getUnreadCount() {
        const response = await api.get(
            "/notifications/unread-count"
        );

        return response.data;
    }

    async markAsRead(notificationId: number) {
        const response = await api.patch(
            `/notifications/${notificationId}/read`
        );

        return response.data;
    }

    async markAllAsRead() {
        const response = await api.patch(
            "/notifications/read-all"
        );

        return response.data;
    }

    async deleteNotification(notificationId: number) {
        await api.delete(
            `/notifications/${notificationId}`
        );
    }

    async clearAll() {
        await api.delete(
            "/notifications"
        );
    }
}

export default new NotificationService();