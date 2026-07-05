import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from "react";

import serverService from "../services/server.service";
import { Server } from "../types/server";

interface ServerContextType {
    servers: Server[];
    loading: boolean;
    refreshServers: () => Promise<void>;
    currentServer: Server | null;
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
    const [servers, setServers] = useState<Server[]>([]);
    const [currentServer, setCurrentServer] =
        useState<Server | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshServers = async () => {
        try {
            const data =
                await serverService.getServers();

            const list =
                data.servers ?? data;

            setServers(list);

            if (
                list.length > 0 &&
                !currentServer
            ) {
                setCurrentServer(list[0]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshServers();
    }, []);

    const value = useMemo(
        () => ({
            servers,
            loading,
            refreshServers,
            currentServer,
            setCurrentServer,
        }),
        [servers, loading, currentServer]
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
            "useServer must be used inside ServerProvider"
        );
    }

    return context;
};