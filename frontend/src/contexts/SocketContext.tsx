import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import websocket from "../services/websocket.service";

import useAuth from "../hooks/useAuth";

interface SocketContextType {
    connected: boolean;

    socket: typeof websocket;
}

const SocketContext =
    createContext<SocketContextType | null>(
        null
    );

export const SocketProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { isAuthenticated } = useAuth();

    const [connected, setConnected] =
        useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;

        websocket.connect();

        const interval = setInterval(() => {
            websocket.ping();

            setConnected(
                websocket.isConnected()
            );
        }, 30000);

        return () => {
            clearInterval(interval);

            websocket.disconnect();
        };
    }, [isAuthenticated]);

    const value = useMemo(
        () => ({
            connected,

            socket: websocket,
        }),
        [connected]
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

    if (!context)
        throw new Error(
            "useSocket must be used inside SocketProvider"
        );

    return context;
};