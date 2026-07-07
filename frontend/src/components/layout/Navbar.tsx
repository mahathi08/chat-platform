import { useNavigate } from "react-router-dom";

import {
    LogOut,
    Moon,
    Sun,
    Search,
    Bell,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { useTheme } from "../../contexts/ThemeContext";
import { useSocket } from "../../contexts/SocketContext";

const Navbar = () => {

    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const { theme, toggleTheme } = useTheme();

    const { connected } = useSocket();

    const handleLogout = async () => {

        await logout();

        navigate("/login");

    };

    return (

        <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6">

            {/* Search */}

            <div className="relative w-96">

                <Search
                    size={18}
                    className="absolute left-3 top-3 text-zinc-500"
                />

                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2 pl-10 pr-4 text-white outline-none transition focus:border-blue-500"
                />

            </div>

            {/* Right Side */}

            <div className="flex items-center gap-5">

                <div className="flex items-center gap-2">

                    <div
                        className={`h-3 w-3 rounded-full ${
                            connected
                                ? "bg-green-500"
                                : "bg-red-500"
                        }`}
                    />

                    <span className="text-sm text-zinc-300">

                        {connected
                            ? "Connected"
                            : "Disconnected"}

                    </span>

                </div>

                <button
                    type="button"
                    aria-label="Notifications"
                    title="Notifications"
                    className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                >
                    <Bell size={20} />
                </button>

                <button
                    type="button"
                    aria-label="Toggle theme"
                    title="Toggle theme"
                    onClick={toggleTheme}
                    className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                >
                    {theme === "dark"
                        ? <Sun size={20} />
                        : <Moon size={20} />}
                </button>

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">

                        {user?.username?.charAt(0).toUpperCase()}

                    </div>

                    <div>

                        <div className="font-semibold text-white">

                            {user?.username}

                        </div>

                        <div className="text-xs text-zinc-400">

                            {user?.email}

                        </div>

                    </div>

                </div>

                <button
                    type="button"
                    aria-label="Logout"
                    title="Logout"
                    onClick={handleLogout}
                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-900/30"
                >
                    <LogOut size={20} />
                </button>

            </div>

        </header>

    );

};

export default Navbar;