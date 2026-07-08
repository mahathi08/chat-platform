import {
    // Bell,
    // Search,
    // Moon,
    // Sun,
    // Hash,
    Settings,
} from "lucide-react";

import {
    Link,
    useLocation,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";
// import { useTheme } from "../../contexts/ThemeContext";
import { useSocket } from "../../contexts/SocketContext";
import { useServer } from "../../contexts/ServerContext";

const Topbar = () => {

    const { user } = useAuth();

    const { connected } = useSocket();

    const { currentServer } = useServer();

    // const {
    //     theme,
    //     toggleTheme,
    // } = useTheme();

    const location = useLocation();

    const currentChannel =
        location.pathname.startsWith("/channels/")
            ? location.pathname.split("/")[2]
            : null;

    return (

        <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-[#313338] px-6 shadow-sm">

            {/* Left */}

            <div className="flex items-center gap-6">

                {currentServer && (

                    <div>

                        <div className="text-xs uppercase tracking-widest text-zinc-500">

                            Server

                        </div>

                        <div className="text-lg font-bold text-white">

                            {currentServer.name}

                        </div>

                    </div>

                )}

                {/* {currentChannel && (

                    <div className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2">

                        <Hash
                            size={16}
                            className="text-zinc-400"
                        />

                        <span className="text-sm text-zinc-300">

                            Channel #{currentChannel}

                        </span>

                    </div>

                )} */}

            </div>

            {/* Search */}

            {/* <div className="relative hidden w-[420px] lg:block">

                <Search
                    size={18}
                    className="absolute left-3 top-3 text-zinc-500"
                />

                <input
                    placeholder="Search messages, members..."
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition focus:border-indigo-500"
                />

            </div> */}

            {/* Right */}

            <div className="flex items-center gap-3">

                <div className="flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-2">

                    <span
                        className={`h-2.5 w-2.5 rounded-full ${
                            connected
                                ? "bg-green-500"
                                : "bg-red-500"
                        }`}
                    />

                    <span className="text-sm text-zinc-300">

                        {connected
                            ? "Online"
                            : "Offline"}

                    </span>

                </div>

                {/* <button className="rounded-xl p-2 transition hover:bg-zinc-700">

                    <Bell size={20} />

                </button> */}

                <Link
                    to="/settings/account"
                    className="rounded-xl p-2 transition hover:bg-zinc-700"
                >

                    <Settings size={20} />

                </Link>

                {/* <button
                    onClick={toggleTheme}
                    className="rounded-xl p-2 transition hover:bg-zinc-700"
                    title="Toggle Theme"
                >

                    {theme === "dark"
                        ? <Sun size={20} />
                        : <Moon size={20} />}

                </button> */}

                <div className="ml-3 flex items-center gap-3 rounded-xl bg-zinc-900 px-3 py-2">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white">

                        {user?.username
                            ?.charAt(0)
                            .toUpperCase()}

                    </div>

                    <div className="hidden lg:block">

                        <div className="text-sm font-semibold text-white">

                            {user?.username}

                        </div>

                        <div className="max-w-[180px] truncate text-xs text-zinc-400">

                            {user?.email}

                        </div>

                    </div>

                </div>

            </div>

        </header>

    );

};

export default Topbar;