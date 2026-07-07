import { WS_URL } from "../utils/constants";
import { getAccessToken } from "../utils/storage";

type MessageHandler = (data: unknown) => void;

class WebSocketService {
    private socket: WebSocket | null = null;

    private handlers = new Set<MessageHandler>();

    private reconnectTimer: number | null = null;

    private manuallyClosed = false;

    connect(): void {
        if (
            this.socket &&
            (
                this.socket.readyState === WebSocket.OPEN ||
                this.socket.readyState === WebSocket.CONNECTING
            )
        ) {
            return;
        }

        const token = getAccessToken();

        if (!token) {
            return;
        }

        this.manuallyClosed = false;

        this.socket = new WebSocket(
            `${WS_URL}?token=${token}`
        );

        this.socket.onopen = () => {
            console.log("WebSocket Connected");

            if (this.reconnectTimer) {
                window.clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
            }
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                this.handlers.forEach((handler) =>
                    handler(data)
                );
            } catch (error) {
                console.error(
                    "Invalid websocket message",
                    error
                );
            }
        };

        this.socket.onerror = (error) => {
            console.error(
                "WebSocket Error",
                error
            );
        };

        this.socket.onclose = () => {
            console.log(
                "WebSocket Disconnected"
            );

            this.socket = null;

            if (!this.manuallyClosed) {
                this.reconnectTimer =
                    window.setTimeout(() => {
                        this.connect();
                    }, 3000);
            }
        };
    }

    disconnect(): void {
        this.manuallyClosed = true;

        if (this.reconnectTimer) {
            window.clearTimeout(
                this.reconnectTimer
            );
            this.reconnectTimer = null;
        }

        this.socket?.close();

        this.socket = null;
    }

    send(data: object): void {
        if (
            this.socket &&
            this.socket.readyState === WebSocket.OPEN
        ) {
            this.socket.send(
                JSON.stringify(data)
            );
        }
    }

    onMessage(
        handler: MessageHandler
    ): void {
        this.handlers.add(handler);
    }

    removeHandler(
        handler: MessageHandler
    ): void {
        this.handlers.delete(handler);
    }

    clearHandlers(): void {
        this.handlers.clear();
    }

    isConnected(): boolean {
        return (
            this.socket?.readyState ===
            WebSocket.OPEN
        );
    }

    ping(): void {
        this.send({
            event: "ping",
        });
    }

    joinServer(serverId: number): void {
        this.send({
            event: "join_server",
            server_id: serverId,
        });
    }

    leaveServer(serverId: number): void {
        this.send({
            event: "leave_server",
            server_id: serverId,
        });
    }

    joinChannel(channelId: number): void {
        this.send({
            event: "join_channel",
            channel_id: channelId,
        });
    }

    leaveChannel(channelId: number): void {
        this.send({
            event: "leave_channel",
            channel_id: channelId,
        });
    }

    joinDM(conversationId: number): void {
        this.send({
            event: "join_dm",
            conversation_id: conversationId,
        });
    }

    leaveDM(conversationId: number): void {
        this.send({
            event: "leave_dm",
            conversation_id: conversationId,
        });
    }

    typingStart(channelId: number): void {
        this.send({
            event: "typing_start",
            channel_id: channelId,
        });
    }

    typingStop(channelId: number): void {
        this.send({
            event: "typing_stop",
            channel_id: channelId,
        });
    }
}

export default new WebSocketService();