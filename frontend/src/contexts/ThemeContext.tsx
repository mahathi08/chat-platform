import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    getTheme,
    saveTheme,
} from "../utils/storage";

type Theme = "light" | "dark";

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

        if (stored === "light" || stored === "dark") {
            return stored;
        }

        if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            return "dark";
        }

        return "light";
    };

    const [theme, setThemeState] = useState<Theme>(
        getInitialTheme
    );

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            theme
        );

        document.documentElement.classList.remove(
            "light",
            "dark"
        );

        document.documentElement.classList.add(theme);

        saveTheme(theme);
    }, [theme]);

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