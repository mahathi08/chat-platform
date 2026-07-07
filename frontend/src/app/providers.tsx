import { ReactNode } from "react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";
import { ServerProvider } from "../contexts/ServerContext";
import { SocketProvider } from "../contexts/SocketContext";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
        },
        mutations: {
            retry: 1,
        },
    },
});

interface ProvidersProps {
    children: ReactNode;
}

const Providers = ({
    children,
}: ProvidersProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AuthProvider>
                    <ServerProvider>
                        <SocketProvider>
                            {children}
                        </SocketProvider>
                    </ServerProvider>
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
};

export default Providers;