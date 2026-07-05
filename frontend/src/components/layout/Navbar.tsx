import { LogOut, Moon, Sun, Search } from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { useTheme } from "../../contexts/ThemeContext";
import { useSocket } from "../../contexts/SocketContext";

const Navbar = () => {
    const { user, logout } = useAuth();

    const { theme, toggleTheme } = useTheme();

    const { connected } = useSocket();

    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-950">

            {/* Search */}

            <div className="relative w-96">

                <Search
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                />

                <input
                    placeholder="Search..."
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
                />

            </div>

            {/* Right */}

            <div className="flex items-center gap-5">

                <div className="flex items-center gap-2">

                    <div
                        className={`h-3 w-3 rounded-full ${
                            connected
                                ? "bg-green-500"
                                : "bg-red-500"
                        }`}
                    />

                    <span className="text-sm">

                        {connected
                            ? "Online"
                            : "Offline"}

                    </span>

                </div>

                <button
                    onClick={toggleTheme}
                    className="rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                    {theme === "dark" ? (
                        <Sun size={20} />
                    ) : (
                        <Moon size={20} />
                    )}
                </button>

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">

                        {user?.username?.[0]?.toUpperCase()}

                    </div>

                    <div>

                        <p className="font-semibold">

                            {user?.username}

                        </p>

                        <p className="text-sm text-gray-500">

                            {user?.email}

                        </p>

                    </div>

                </div>

                <button
                    onClick={logout}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                    <LogOut size={20} />
                </button>

            </div>

        </header>
    );
};

export default Navbar;