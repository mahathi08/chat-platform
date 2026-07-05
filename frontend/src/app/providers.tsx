import { ReactNode } from "react";

import { AuthProvider } from "../contexts/AuthContext";
import { SocketProvider } from "../contexts/SocketContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { ServerProvider } from "../contexts/ServerContext";

interface ProvidersProps {
    children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ServerProvider>
                    <SocketProvider>
                        {children}
                    </SocketProvider>
                </ServerProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default Providers;