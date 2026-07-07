import { Link } from "react-router-dom";

import {
    Server,
    MessageSquare,
    Users,
    Bell,
    ArrowRight,
} from "lucide-react";

import { useServer } from "../../contexts/ServerContext";
import useAuth from "../../hooks/useAuth";

const Dashboard = () => {

    const { user } = useAuth();

    const {
        servers,
        loading,
    } = useServer();

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center bg-zinc-900 text-white">
                Loading dashboard...
            </div>
        );
    }

    return (

        <div className="h-full overflow-y-auto bg-zinc-900 p-8">

            <div className="mx-auto max-w-6xl">

                <h1 className="text-4xl font-bold text-white">
                    Dashboard
                </h1>

                <p className="mt-2 text-zinc-400">

                    Welcome back,&nbsp;

                    <span className="font-semibold text-white">
                        {user?.username ?? "User"}
                    </span>

                </p>

                {/* Statistics */}

                <div className="mt-10 grid gap-6 md:grid-cols-4">

                    <div className="rounded-xl bg-zinc-800 p-6">

                        <Server
                            size={32}
                            className="mb-4 text-blue-500"
                        />

                        <h2 className="text-3xl font-bold text-white">
                            {servers.length}
                        </h2>

                        <p className="mt-1 text-zinc-400">
                            Servers
                        </p>

                    </div>

                    <div className="rounded-xl bg-zinc-800 p-6">

                        <Users
                            size={32}
                            className="mb-4 text-green-500"
                        />

                        <h2 className="text-3xl font-bold text-white">
                            —
                        </h2>

                        <p className="mt-1 text-zinc-400">
                            Members
                        </p>

                    </div>

                    <div className="rounded-xl bg-zinc-800 p-6">

                        <MessageSquare
                            size={32}
                            className="mb-4 text-purple-500"
                        />

                        <h2 className="text-3xl font-bold text-white">
                            —
                        </h2>

                        <p className="mt-1 text-zinc-400">
                            Messages
                        </p>

                    </div>

                    <div className="rounded-xl bg-zinc-800 p-6">

                        <Bell
                            size={32}
                            className="mb-4 text-yellow-500"
                        />

                        <h2 className="text-3xl font-bold text-white">
                            —
                        </h2>

                        <p className="mt-1 text-zinc-400">
                            Notifications
                        </p>

                    </div>

                </div>

                {/* Quick Actions */}

                <div className="mt-10 rounded-xl bg-zinc-800 p-6">

                    <h2 className="mb-5 text-2xl font-semibold text-white">
                        Quick Actions
                    </h2>

                    <div className="flex flex-wrap gap-4">

                        <Link
                            to="/servers/create"
                            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Create Server
                        </Link>

                        <Link
                            to="/explore"
                            className="rounded-lg border border-zinc-600 px-5 py-3 font-semibold text-white transition hover:bg-zinc-700"
                        >
                            Explore Servers
                        </Link>

                        <Link
                            to="/notifications"
                            className="rounded-lg border border-zinc-600 px-5 py-3 font-semibold text-white transition hover:bg-zinc-700"
                        >
                            Notifications
                        </Link>

                    </div>

                </div>

                {/* Recent Servers */}

                <div className="mt-10 rounded-xl bg-zinc-800 p-6">

                    <h2 className="mb-5 text-2xl font-semibold text-white">
                        Recent Servers
                    </h2>

                    {servers.length === 0 ? (

                        <div className="rounded-lg border border-dashed border-zinc-700 p-8 text-center">

                            <p className="text-zinc-400">
                                You haven't joined any servers yet.
                            </p>

                            <Link
                                to="/servers/create"
                                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                            >
                                Create your first server

                                <ArrowRight size={18} />

                            </Link>

                        </div>

                    ) : (

                        <div className="space-y-4">

                            {servers.map((server) => (

                                <Link
                                    key={server.id}
                                    to={`/servers/${server.id}`}
                                    className="block rounded-xl border border-zinc-700 p-5 transition hover:border-blue-500 hover:bg-zinc-700"
                                >

                                    <h3 className="text-lg font-semibold text-white">
                                        {server.name}
                                    </h3>

                                    <p className="mt-2 text-sm text-zinc-400">
                                        {server.description ??
                                            "No description"}
                                    </p>

                                </Link>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

};

export default Dashboard;