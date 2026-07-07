import { Link } from "react-router-dom";
import {
    Hash,
    Plus,
    LogOut,
    Settings,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { useServer } from "../../contexts/ServerContext";

const Sidebar = () => {
    const { currentServer } = useServer();

    const { user, logout } = useAuth();

    return (
        <aside className="flex w-72 flex-col border-r border-zinc-800 bg-zinc-900">

            {/* Server Header */}
            <div className="border-b border-zinc-800 p-4">
                <h2 className="truncate text-lg font-bold text-white">
                    {currentServer?.name ?? "Select a Server"}
                </h2>

                {currentServer?.description && (
                    <p className="mt-1 truncate text-sm text-zinc-400">
                        {currentServer.description}
                    </p>
                )}
            </div>

            {/* Channels */}
            <div className="flex-1 overflow-y-auto p-3">

                <div className="mb-3 flex items-center justify-between">

                    <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                        Channels
                    </h3>

                    {currentServer && (
                        <Link
                            to={`/servers/${currentServer.id}/channels/create`}
                            className="rounded p-1 hover:bg-zinc-800"
                        >
                            <Plus size={16} />
                        </Link>
                    )}

                </div>

                {currentServer?.channels?.length ? (
                    currentServer.channels.map(
                        (channel) => (
                            <Link
                                key={channel.id}
                                to={`/channels/${channel.id}`}
                                className="mb-1 flex items-center gap-2 rounded-lg px-3 py-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                            >
                                <Hash size={18} />

                                <span>
                                    {channel.name}
                                </span>
                            </Link>
                        )
                    )
                ) : (
                    <div className="text-sm text-zinc-500">
                        No channels
                    </div>
                )}
            </div>

            {/* User */}
            <div className="border-t border-zinc-800 p-4">

                <div className="mb-4">

                    <div className="font-semibold text-white">
                        {user?.username}
                    </div>

                    <div className="text-sm text-zinc-400">
                        {user?.email}
                    </div>

                </div>

                <Link
                    to="/settings/account"
                    className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-zinc-300 hover:bg-zinc-800"
                >
                    <Settings size={18} />
                    Settings
                </Link>

                <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-red-400 hover:bg-red-500/10"
                >
                    <LogOut size={18} />
                    Logout
                </button>

            </div>

        </aside>
    );
};

export default Sidebar;