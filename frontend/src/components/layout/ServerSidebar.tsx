import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { useServer } from "../../contexts/ServerContext";

const ServerSidebar = () => {
    const {
        servers,
        loading,
        currentServer,
        setCurrentServer,
    } = useServer();

    if (loading) {
        return (
            <aside className="flex w-[72px] items-center justify-center border-r border-zinc-800 bg-zinc-950">
                <span className="text-sm text-zinc-500">
                    ...
                </span>
            </aside>
        );
    }

    return (
        <aside className="flex h-full w-[72px] flex-col items-center gap-3 overflow-y-auto border-r border-zinc-800 bg-zinc-950 py-4">

            <Link
                to="/servers/create"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 transition hover:bg-indigo-600 hover:text-white"
            >
                <Plus size={22} />
            </Link>

            <div className="h-px w-10 bg-zinc-700" />

            {servers.map((server) => {
                const active =
                    currentServer?.id === server.id;

                return (
                    <Link
                        key={server.id}
                        to={`/servers/${server.id}`}
                        onClick={() =>
                            setCurrentServer(server)
                        }
                        title={server.name}
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold transition
${
    active
        ? "bg-indigo-600 text-white"
        : "bg-zinc-800 hover:bg-zinc-700"
}`}
                    >
                        {server.icon_url ? (
                            <img
                                src={server.icon_url}
                                alt={server.name}
                                className="h-full w-full rounded-2xl object-cover"
                            />
                        ) : (
                            server.name
                                .charAt(0)
                                .toUpperCase()
                        )}
                    </Link>
                );
            })}

            {servers.length === 0 && (
                <div className="pt-4 text-center text-xs text-zinc-500">
                    No Servers
                </div>
            )}
        </aside>
    );
};

export default ServerSidebar;