import { Link } from "react-router-dom";

import {
    Compass,
    Plus,
    Search,
    ArrowRight,
} from "lucide-react";

const Explore = () => {

    return (

        <div className="h-full overflow-y-auto bg-zinc-900 p-8">

            <div className="mx-auto max-w-6xl">

                <div className="mb-10">

                    <h1 className="flex items-center gap-3 text-4xl font-bold text-white">

                        <Compass size={36} />

                        Explore Servers

                    </h1>

                    <p className="mt-3 text-zinc-400">

                        Discover communities, meet new people, and collaborate
                        with teams around the world.

                    </p>

                </div>

                {/* Search */}

                <div className="mb-10">

                    <div className="flex items-center rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3">

                        <Search
                            size={20}
                            className="mr-3 text-zinc-400"
                        />

                        <input
                            type="text"
                            placeholder="Search servers (coming soon)"
                            disabled
                            className="w-full bg-transparent text-white outline-none placeholder:text-zinc-500"
                        />

                    </div>

                </div>

                {/* Placeholder */}

                <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-800/40 p-16 text-center">

                    <Compass
                        size={72}
                        className="mx-auto mb-6 text-zinc-500"
                    />

                    <h2 className="text-3xl font-bold text-white">

                        Server Discovery Coming Soon

                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-zinc-400">

                        Your backend currently doesn't expose a public server
                        discovery API. Once an endpoint such as
                        <span className="mx-1 font-mono text-blue-400">
                            GET /servers/public
                        </span>
                        is implemented, this page can display searchable
                        community servers with categories, member counts,
                        descriptions, and one-click joining.

                    </p>

                    <div className="mt-10 flex flex-wrap justify-center gap-5">

                        <Link
                            to="/servers/create"
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >

                            <Plus size={18} />

                            Create Server

                        </Link>

                        <Link
                            to="/dashboard"
                            className="flex items-center gap-2 rounded-lg border border-zinc-600 px-6 py-3 font-semibold text-white transition hover:bg-zinc-700"
                        >

                            Dashboard

                            <ArrowRight size={18} />

                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Explore;