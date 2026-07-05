import { WS_URL } from "../utils/constants";
import { getAccessToken } from "../utils/storage";

type MessageHandler = (data: any) => void;

class WebSocketService {
    private socket: WebSocket | null = null;

    private handlers: MessageHandler[] = [];

    connect() {
        if (
            this.socket &&
            this.socket.readyState === WebSocket.OPEN
        ) {
            return;
        }

        const token = getAccessToken();

        if (!token) return;

        this.socket = new WebSocket(
            `${WS_URL}?token=${token}`
        );

        this.socket.onopen = () => {
            console.log("WebSocket Connected");
        };

        this.socket.onclose = () => {
            console.log("WebSocket Disconnected");
        };

        this.socket.onerror = (error) => {
            console.error(error);
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            this.handlers.forEach((handler) =>
                handler(data)
            );
        };
    }

    disconnect() {
        this.socket?.close();

        this.socket = null;
    }

    send(data: object) {
        if (
            this.socket &&
            this.socket.readyState === WebSocket.OPEN
        ) {
            this.socket.send(JSON.stringify(data));
        }
    }

    onMessage(handler: MessageHandler) {
        this.handlers.push(handler);
    }

    removeHandler(handler: MessageHandler) {
        this.handlers =
            this.handlers.filter(
                (h) => h !== handler
            );
    }

    isConnected() {
        return (
            this.socket?.readyState ===
            WebSocket.OPEN
        );
    }

    ping() {
        this.send({
            event: "ping",
        });
    }

    joinServer(serverId: number) {
        this.send({
            event: "join_server",
            server_id: serverId,
        });
    }

    leaveServer(serverId: number) {
        this.send({
            event: "leave_server",
            server_id: serverId,
        });
    }

    joinChannel(channelId: number) {
        this.send({
            event: "join_channel",
            channel_id: channelId,
        });
    }

    leaveChannel(channelId: number) {
        this.send({
            event: "leave_channel",
            channel_id: channelId,
        });
    }

    joinDM(conversationId: number) {
        this.send({
            event: "join_dm",
            conversation_id: conversationId,
        });
    }

    leaveDM(conversationId: number) {
        this.send({
            event: "leave_dm",
            conversation_id: conversationId,
        });
    }

    typingStart(channelId: number) {
        this.send({
            event: "typing_start",
            channel_id: channelId,
        });
    }

    typingStop(channelId: number) {
        this.send({
            event: "typing_stop",
            channel_id: channelId,
        });
    }
}

export default new WebSocketService();