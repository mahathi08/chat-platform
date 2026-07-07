import {
    useEffect,
    useState,
} from "react";

import notificationService from "../../services/notification.service";

interface Notification {
    id: number;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

const Notifications = () => {

    const [
        notifications,
        setNotifications,
    ] = useState<Notification[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    useEffect(() => {

        loadNotifications();

    }, []);

    const loadNotifications = async () => {

        try {

            const response =
                await notificationService.getNotifications();

            setNotifications(
                response.notifications ??
                response
            );

        } catch (err: any) {

            setError(
                err?.response?.data?.detail ??
                "Unable to load notifications."
            );

        } finally {

            setLoading(false);

        }

    };

    const markRead = async (
        id: number
    ) => {

        try {

            await notificationService.markAsRead(
                id
            );

            setNotifications((old) =>
                old.map((notification) =>
                    notification.id === id
                        ? {
                              ...notification,
                              is_read: true,
                          }
                        : notification
                )
            );

        } catch (err) {

            console.error(err);

        }

    };

    const markAll = async () => {

        try {

            await notificationService.markAllAsRead();

            setNotifications((old) =>
                old.map((notification) => ({
                    ...notification,
                    is_read: true,
                }))
            );

        } catch (err) {

            console.error(err);

        }

    };

    const remove = async (
        id: number
    ) => {

        try {

            await notificationService.deleteNotification(
                id
            );

            setNotifications((old) =>
                old.filter(
                    (notification) =>
                        notification.id !== id
                )
            );

        } catch (err) {

            console.error(err);

        }

    };

    if (loading) {

        return (

            <div className="flex h-full items-center justify-center bg-zinc-900 text-white">

                Loading notifications...

            </div>

        );

    }

    return (

        <div className="h-full overflow-y-auto bg-zinc-900 p-8">

            <div className="mx-auto max-w-4xl">

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <h1 className="text-3xl font-bold text-white">

                            Notifications

                        </h1>

                        <p className="mt-2 text-zinc-400">

                            Stay updated with your activity.

                        </p>

                    </div>

                    <button
                        onClick={markAll}
                        className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700"
                    >

                        Mark All Read

                    </button>

                </div>

                {error && (

                    <div className="mb-6 rounded-lg bg-red-900/30 p-3 text-red-300">

                        {error}

                    </div>

                )}

                <div className="space-y-4">

                    {notifications.map(
                        (notification) => (

                            <div
                                key={notification.id}
                                className={`rounded-xl border p-5 ${
                                    notification.is_read
                                        ? "border-zinc-800 bg-zinc-950"
                                        : "border-blue-700 bg-zinc-900"
                                }`}
                            >

                                <div className="flex items-start justify-between">

                                    <div>

                                        <h2 className="font-semibold text-white">

                                            {notification.title}

                                        </h2>

                                        <p className="mt-2 text-zinc-300">

                                            {notification.message}

                                        </p>

                                        <p className="mt-3 text-sm text-zinc-500">

                                            {new Date(
                                                notification.created_at
                                            ).toLocaleString()}

                                        </p>

                                    </div>

                                    <div className="flex gap-2">

                                        {!notification.is_read && (

                                            <button
                                                onClick={() =>
                                                    markRead(
                                                        notification.id
                                                    )
                                                }
                                                className="rounded bg-green-600 px-3 py-1 text-sm text-white transition hover:bg-green-700"
                                            >

                                                Read

                                            </button>

                                        )}

                                        <button
                                            onClick={() =>
                                                remove(
                                                    notification.id
                                                )
                                            }
                                            className="rounded bg-red-600 px-3 py-1 text-sm text-white transition hover:bg-red-700"
                                        >

                                            Delete

                                        </button>

                                    </div>

                                </div>

                            </div>

                        )
                    )}

                    {notifications.length === 0 && (

                        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-10 text-center text-zinc-500">

                            No notifications.

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

};

export default Notifications;