import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type {ReactNode} from "react";
import authService from "../services/auth.service";

import type {
    LoginRequest,
    RegisterRequest,
} from "../services/auth.service";

import type { User } from "../types/user";

import {
    getAccessToken,
    getUser,
    saveUser,
    clearStorage,
} from "../utils/storage";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;

    login: (
        credentials: LoginRequest
    ) => Promise<void>;

    register: (
        data: RegisterRequest
    ) => Promise<void>;

    logout: () => Promise<void>;

    refreshUser: () => Promise<void>;

    setUser: React.Dispatch<
        React.SetStateAction<User | null>
    >;
}

const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );

export const AuthProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    const initialize = useCallback(async () => {
        try {
            const token = getAccessToken();

            if (!token) {
                setLoading(false);
                return;
            }

            const cachedUser =
                getUser<User>();

            if (cachedUser) {
                setUser(cachedUser);
            }

            const currentUser =
                await authService.getCurrentUser();

            saveUser(currentUser);

            setUser(currentUser);
        } catch (error) {
            console.error(error);

            clearStorage();

            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const login = async (
        credentials: LoginRequest
    ) => {
        setLoading(true);

        try {
            const currentUser =
                await authService.login(
                    credentials
                );

            saveUser(currentUser);

            setUser(currentUser);
        } finally {
            setLoading(false);
        }
    };

    const register = async (
        data: RegisterRequest
    ) => {
        setLoading(true);

        try {
            await authService.register(data);

            await login({
                email: data.email,
                password: data.password,
            });
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await authService.logout();

        clearStorage();

        setUser(null);
    };

    const refreshUser = async () => {
        const currentUser =
            await authService.getCurrentUser();

        saveUser(currentUser);

        setUser(currentUser);
    };

    const value = useMemo(
        () => ({
            user,
            loading,
            isAuthenticated: !!user,

            login,
            register,
            logout,

            refreshUser,

            setUser,
        }),
        [user, loading]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuthContext must be used inside AuthProvider"
        );
    }

    return context;
};