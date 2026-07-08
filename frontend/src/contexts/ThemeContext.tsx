import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type {ReactNode} from "react";
import {
    getTheme,
    saveTheme,
} from "../utils/storage";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<
    ThemeContextType | undefined
>(undefined);

export const ThemeProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const getInitialTheme = (): Theme => {
        const stored = getTheme();

        if (
            stored === "light" ||
            stored === "dark" ||
            stored === "system"
        ){
            return stored;
        }

        return "system";
    };

    const [theme, setThemeState] = useState<Theme>(
        getInitialTheme
    );

    useEffect(() => {

        let resolved = theme;

        if(theme==="system"){

            resolved = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
                ? "dark"
                : "light";

        }

        document.documentElement.classList.remove(
            "light",
            "dark"
        );

        document.documentElement.classList.add(
            resolved
        );

        document.documentElement.setAttribute(
            "data-theme",
            resolved
        );

        saveTheme(theme);

    },[theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const toggleTheme = () => {
        setThemeState((prev) =>
            prev === "dark" ? "light" : "dark"
        );
    };

    const value = useMemo(
        () => ({
            theme,
            toggleTheme,
            setTheme,
        }),
        [theme]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            "useTheme must be used within ThemeProvider"
        );
    }

    return context;
};