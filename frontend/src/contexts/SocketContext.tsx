import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type {ReactNode} from "react";
import websocket from "../services/websocket.service";
import useAuth from "../hooks/useAuth";

interface SocketContextType {
    connected: boolean;

    socket: typeof websocket;

    connect: () => void;

    disconnect: () => void;
}

const SocketContext =
    createContext<SocketContextType | undefined>(
        undefined
    );

export const SocketProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { isAuthenticated } = useAuth();

    const [connected, setConnected] =
        useState(false);

    const connect = useCallback(() => {
        websocket.connect();

        setConnected(
            websocket.isConnected()
        );
    }, []);

    const disconnect = useCallback(() => {
        websocket.disconnect();

        setConnected(false);
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            disconnect();
            return;
        }

        connect();

        const interval = window.setInterval(() => {
            websocket.ping();

            setConnected(
                websocket.isConnected()
            );
        }, 30000);

        return () => {
            window.clearInterval(interval);

            disconnect();
        };
    }, [
        isAuthenticated,
        connect,
        disconnect,
    ]);

    const value = useMemo(
        () => ({
            connected,
            socket: websocket,
            connect,
            disconnect,
        }),
        [
            connected,
            connect,
            disconnect,
        ]
    );

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context =
        useContext(SocketContext);

    if (!context) {
        throw new Error(
            "useSocket must be used inside SocketProvider."
        );
    }

    return context;
};