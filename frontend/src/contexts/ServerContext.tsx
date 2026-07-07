import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type {ReactNode} from "react";
import { getAccessToken } from "../utils/storage";
import serverService from "../services/server.service";
import type { Server } from "../types/server";

interface ServerContextType {
    servers: Server[];
    loading: boolean;

    currentServer: Server | null;

    refreshServers: () => Promise<void>;

    setCurrentServer: React.Dispatch<
        React.SetStateAction<Server | null>
    >;
}

const ServerContext = createContext<
    ServerContextType | undefined
>(undefined);

export const ServerProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [servers, setServers] =
        useState<Server[]>([]);

    const [currentServer, setCurrentServer] =
        useState<Server | null>(null);

    const [loading, setLoading] =
        useState(true);

    const refreshServers = useCallback(async () => {

        const token = getAccessToken();

        if (!token) {
            setServers([]);
            setCurrentServer(null);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const response = await serverService.getServers();

            const list = response.servers ?? response;

            setServers(list);

            if (list.length === 0) {
                setCurrentServer(null);
                return;
            }

            setCurrentServer(previous =>
                previous
                    ? list.find(s => s.id === previous.id) ?? list[0]
                    : list[0]
            );
        } catch (error) {
            console.error(error);
            setServers([]);
            setCurrentServer(null);
        } finally {
            setLoading(false);
        }

    }, []);

    useEffect(() => {

        const token = getAccessToken();

        if (!token) {
            setLoading(false);
            return;
        }

        refreshServers();

    }, [refreshServers]);

    const value = useMemo(
        () => ({
            servers,
            loading,
            currentServer,
            refreshServers,
            setCurrentServer,
        }),
        [
            servers,
            loading,
            currentServer,
            refreshServers,
        ]
    );

    return (
        <ServerContext.Provider value={value}>
            {children}
        </ServerContext.Provider>
    );
};

export const useServer = () => {
    const context =
        useContext(ServerContext);

    if (!context) {
        throw new Error(
            "useServer must be used inside ServerProvider."
        );
    }

    return context;
};