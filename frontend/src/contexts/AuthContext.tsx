import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from "react";

import authService, {
    LoginRequest,
    RegisterRequest,
} from "../services/auth.service";

import {
    getAccessToken,
    getUser,
    saveUser,
} from "../utils/storage";

export interface User {
    id: number;
    username: string;
    email: string;
    avatar_url?: string;
    bio?: string;
    status?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;

    login: (credentials: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;

    refreshUser: () => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export const AuthProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initialize();
    }, []);

    const initialize = async () => {
        try {
            const token = getAccessToken();

            if (!token) {
                setLoading(false);
                return;
            }

            const cachedUser = getUser<User>();

            if (cachedUser) {
                setUser(cachedUser);
            }

            const currentUser =
                await authService.getCurrentUser();

            saveUser(currentUser);

            setUser(currentUser);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (
        credentials: LoginRequest
    ) => {
        setLoading(true);

        try {
            const user = await authService.login(
                credentials
            );

            setUser(user);
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

        setUser(null);
    };

    const refreshUser = async () => {
        const current =
            await authService.getCurrentUser();

        saveUser(current);

        setUser(current);
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
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuthContext must be used inside AuthProvider"
        );
    }

    return context;
};