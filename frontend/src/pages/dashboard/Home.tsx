import { Link } from "react-router-dom";

import {
    Plus,
    Compass,
    ArrowRight,
} from "lucide-react";

import { useServer } from "../../contexts/ServerContext";

const Home = () => {

    const {
        servers,
        loading,
    } = useServer();

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center bg-zinc-900 text-white">
                Loading...
            </div>
        );
    }

    return (

        <div className="h-full overflow-y-auto bg-zinc-900 p-8">

            <div className="mx-auto max-w-6xl">

                <div className="text-center">

                    <h1 className="text-5xl font-bold text-white">

                        Welcome to Chat Platform

                    </h1>

                    <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">

                        A real-time collaboration platform inspired by Discord.
                        Join communities, chat instantly, collaborate with your
                        friends, and build amazing servers.

                    </p>

                </div>

                {servers.length > 0 ? (

                    <div className="mt-14">

                        <div className="mb-8 flex items-center justify-between">

                            <h2 className="text-2xl font-bold text-white">

                                Your Servers

                            </h2>

                            <Link
                                to="/servers/create"
                                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                            >
                                Create Server
                            </Link>

                        </div>

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                            {servers.map((server) => (

                                <Link
                                    key={server.id}
                                    to={`/servers/${server.id}`}
                                    className="rounded-xl border border-zinc-700 bg-zinc-800 p-6 transition hover:border-blue-500 hover:bg-zinc-700"
                                >

                                    <h3 className="text-xl font-semibold text-white">

                                        {server.name}

                                    </h3>

                                    <p className="mt-3 text-sm text-zinc-400">

                                        {server.description ??
                                            "No description available."}

                                    </p>

                                </Link>

                            ))}

                        </div>

                    </div>

                ) : (

                    <div className="mt-20 rounded-2xl border border-dashed border-zinc-700 bg-zinc-800/40 p-12 text-center">

                        <h2 className="text-2xl font-bold text-white">

                            No Servers Yet

                        </h2>

                        <p className="mt-4 text-zinc-400">

                            Create your first server or explore public communities
                            to start chatting.

                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-5">

                            <Link
                                to="/servers/create"
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                            >

                                <Plus size={20} />

                                Create Server

                            </Link>

                            <Link
                                to="/explore"
                                className="flex items-center gap-2 rounded-lg border border-zinc-600 px-6 py-3 font-semibold text-white transition hover:bg-zinc-700"
                            >

                                <Compass size={20} />

                                Explore Servers

                                <ArrowRight size={18} />

                            </Link>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

};

export default Home;