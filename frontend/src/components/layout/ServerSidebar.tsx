import { Link } from "react-router-dom";
import { useServer } from "../../contexts/ServerContext";

const ServerSidebar = () => {
    const {
        servers,
        loading,
        setCurrentServer,
    } = useServer();

    if (loading) {
        return (
            <aside className="w-64 border-r bg-white p-4 dark:bg-gray-900">
                Loading servers...
            </aside>
        );
    }

    return (
        <aside className="w-64 overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b p-4">
                <h2 className="text-lg font-bold">
                    Servers
                </h2>
            </div>

            <div className="space-y-2 p-3">
                {servers.map((server) => (
                    <Link
                        key={server.id}
                        to={`/servers/${server.id}`}
                        onClick={() =>
                            setCurrentServer(server)
                        }
                        className="block rounded-lg p-3 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <div className="font-semibold">
                            {server.name}
                        </div>

                        {server.description && (
                            <div className="mt-1 text-sm text-gray-500">
                                {server.description}
                            </div>
                        )}
                    </Link>
                ))}

                {servers.length === 0 && (
                    <div className="py-10 text-center text-gray-500">
                        No servers yet.
                    </div>
                )}
            </div>
        </aside>
    );
};

export default ServerSidebar;