import api from "./api";

class NotificationService {

    async getNotifications(
        page = 1,
        pageSize = 25,
    ) {

        const response =
            await api.get(
                "/notifications",
                {
                    params: {
                        page,
                        page_size: pageSize,
                    },
                }
            );

        return response.data;

    }

    async markAsRead(
        notificationId: number,
    ) {

        const response =
            await api.patch(
                `/notifications/${notificationId}/read`
            );

        return response.data;

    }

    async markAllAsRead() {

        const response =
            await api.patch(
                "/notifications/read-all"
            );

        return response.data;

    }

    async deleteNotification(
        notificationId: number,
    ) {

        await api.delete(
            `/notifications/${notificationId}`
        );

    }

}

export default new NotificationService();