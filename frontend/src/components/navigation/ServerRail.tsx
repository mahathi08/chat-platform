import { Link, useNavigate } from "react-router-dom";

import {
    Home,
    Plus,
    Compass,
    Settings,
    User,
    LogIn,
} from "lucide-react";

import { useServer } from "../../contexts/ServerContext";

const ServerRail = () => {

    const navigate = useNavigate();

    const {
        servers,
        loading,
        currentServer,
        setCurrentServer,
    } = useServer();

    if (loading) {

        return (

            <aside className="flex h-screen w-20 items-center justify-center border-r border-zinc-800 bg-[#1E1F22]">

                <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-700" />

            </aside>

        );

    }

    return (

        <aside className="flex h-screen w-20 flex-col justify-between border-r border-zinc-800 bg-[#1E1F22] py-4">

            {/* ==========================
                    Top
            ========================== */}

            <div className="flex flex-col items-center gap-3">

                {/* Home */}

                <button
                    title="Home"
                    onClick={() => navigate("/")}
                    className="group relative"
                >

                    <span className="absolute -left-3 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full bg-white transition-all duration-200 group-hover:h-6" />

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white transition hover:bg-indigo-500">

                        <Home size={22} />

                    </div>

                </button>

                <div className="h-px w-10 bg-zinc-700" />

                {/* Servers */}

                {servers.map((server) => {

                    const active =
                        currentServer?.id ===
                        server.id;

                    return (

                        <Link
                            key={server.id}
                            to={`/servers/${server.id}`}
                            onClick={() =>
                                setCurrentServer(
                                    server
                                )
                            }
                            title={server.name}
                            className="group relative"
                        >

                            <span
                                className={`absolute -left-3 top-1/2 -translate-y-1/2 rounded-r-full bg-white transition-all duration-200 ${
                                    active
                                        ? "h-10 w-1"
                                        : "h-0 w-1 group-hover:h-6"
                                }`}
                            />

                            <div
                                className={`flex h-12 w-12 items-center justify-center overflow-hidden text-lg font-bold text-white transition-all duration-200 ${
                                    active
                                        ? "rounded-2xl bg-indigo-600"
                                        : "rounded-full bg-zinc-700 hover:rounded-2xl hover:bg-indigo-600"
                                }`}
                            >

                                {server.icon_url ? (

                                    <img
                                        src={
                                            server.icon_url
                                        }
                                        alt={
                                            server.name
                                        }
                                        className="h-full w-full object-cover"
                                    />

                                ) : (

                                    server.name
                                        .charAt(0)
                                        .toUpperCase()

                                )}

                            </div>

                        </Link>

                    );

                })}

                <div className="my-2 h-px w-10 bg-zinc-700" />

                {/* Create */}

                <Link
                    to="/servers/create"
                    title="Create Server"
                    className="group"
                >

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-700 text-green-400 transition-all duration-200 hover:rounded-2xl hover:bg-green-600 hover:text-white">

                        <Plus size={22} />

                    </div>

                </Link>

                {/* Join */}

                <Link
                    to="/servers/join"
                    title="Join Server"
                    className="group"
                >

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-700 text-sky-400 transition-all duration-200 hover:rounded-2xl hover:bg-sky-600 hover:text-white">

                        <LogIn size={20} />

                    </div>

                </Link>

                {/* Explore */}

                <Link
                    to="/explore"
                    title="Explore"
                    className="group"
                >

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-700 text-zinc-300 transition-all duration-200 hover:rounded-2xl hover:bg-zinc-600 hover:text-white">

                        <Compass size={20} />

                    </div>

                </Link>

            </div>

            {/* ==========================
                    Bottom
            ========================== */}

            <div className="flex flex-col items-center gap-3">

                <button
                    title="Settings"
                    onClick={() =>
                        navigate(
                            "/settings/account"
                        )
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-700 text-zinc-300 transition-all duration-200 hover:rounded-2xl hover:bg-zinc-600 hover:text-white"
                >

                    <Settings size={18} />

                </button>

                <button
                    title="Profile"
                    onClick={() =>
                        navigate(
                            "/settings/profile"
                        )
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-700 text-zinc-300 transition-all duration-200 hover:rounded-2xl hover:bg-zinc-600 hover:text-white"
                >

                    <User size={18} />

                </button>

            </div>

        </aside>

    );

};

export default ServerRail;