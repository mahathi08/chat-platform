import {
    useEffect,
    useState,
    useRef,
} from "react";

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    Hash,
    Plus,
    ChevronDown,
    Volume2,
    Users,
    UserPlus,
    Settings,
    LogOut,
    Trash2,
} from "lucide-react";

import { useServer } from "../../contexts/ServerContext";

import channelService from "../../services/channel.service";
import serverService from "../../services/server.service";
import useAuth from "../../hooks/useAuth";
import type { Channel } from "../../types/channel";

const ChannelSidebar = () => {

    const location = useLocation();

    const navigate = useNavigate();

    const {
        currentServer,
        refreshServers,
    } = useServer();
    const { user } = useAuth();
    const [channels, setChannels] =
        useState<Channel[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [menuOpen, setMenuOpen] =
        useState(false);
    const [myRole, setMyRole] =
        useState("");

    const isOwner =
        myRole === "OWNER";

    const isAdmin =
        myRole === "ADMIN";

    const menuRef =
        useRef<HTMLDivElement>(null);

    useEffect(() => {

        if (!currentServer) {

            setChannels([]);

            return;

        }

        loadChannels();

        loadRole();

    }, [currentServer?.id]);

    useEffect(() => {

        const handleClick = (
            e: MouseEvent
        ) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(
                    e.target as Node
                )
            ) {

                setMenuOpen(false);

            }

        };

        document.addEventListener(
            "mousedown",
            handleClick
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClick
            );

        };

    }, []);

    const loadChannels = async () => {

        if (!currentServer)
            return;

        setLoading(true);

        try {

            const response =
                await channelService.getServerChannels(
                    currentServer.id
                );

            setChannels(
                response.channels ??
                response
            );

        }

        catch (err) {

            console.error(err);

            setChannels([]);

        }

        finally {

            setLoading(false);

        }

    };

    const loadRole = async () => {

        if (!currentServer)
            return;

        try {

            const response =
                await serverService.getMembers(
                    currentServer.id
                );

            const members =
                response.members ??
                response;

            const me =
                members.find(
                    (m: any) =>
                        m.user.id === user?.id
                );

            setMyRole(
                me?.role ?? ""
            );

        }

        catch {

            setMyRole("");

        }

    };

    const leaveServer = async () => {

        if (!currentServer)
            return;

        if (
            !window.confirm(
                `Leave "${currentServer.name}"?`
            )
        ) {
            return;
        }

        await serverService.leaveServer(
            currentServer.id
        );

        await refreshServers();

        navigate("/");

    };

    const deleteServer = async () => {

        if (!currentServer)
            return;

        if (
            !window.confirm(
                `Delete "${currentServer.name}" permanently?\n\nThis cannot be undone.`
            )
        ) {
            return;
        }

        await serverService.deleteServer(
            currentServer.id
        );

        await refreshServers();

        navigate("/");

    };
    if (!currentServer) {

        return (

            <aside className="flex w-72 items-center justify-center border-r border-zinc-800 bg-[#2B2D31] text-zinc-500">

                Select a server

            </aside>

        );

    }

    return (

    <aside className="flex w-72 flex-col border-r border-zinc-800 bg-[#2B2D31]">

        {/* ==========================
            Server Header
        ========================== */}

        <div
            ref={menuRef}
            className="relative border-b border-zinc-900"
        >

            <button
                onClick={() =>
                    setMenuOpen(prev => !prev)
                }
                className="flex h-14 w-full items-center justify-between px-4 hover:bg-zinc-700"
            >

                <div>

                    <h2 className="truncate text-base font-bold text-white">

                        {currentServer.name}

                    </h2>

                    <p className="truncate text-xs text-zinc-400">

                        {currentServer.description ??
                            "No description"}

                    </p>

                </div>

                <ChevronDown
                    size={18}
                    className={`transition ${
                        menuOpen
                            ? "rotate-180"
                            : ""
                    }`}
                />

            </button>

            {menuOpen && (

                <div className="absolute left-2 right-2 top-16 z-50 rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl">

                    {/* Everyone */}

                    <Link
                        to={`/servers/${currentServer.id}/invite`}
                        onClick={() =>
                            setMenuOpen(false)
                        }
                        className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800"
                    >

                        <UserPlus size={18} />

                        Invite People

                    </Link>

                    <Link
                        to={`/servers/${currentServer.id}/members`}
                        onClick={() =>
                            setMenuOpen(false)
                        }
                        className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800"
                    >

                        <Users size={18} />

                        Members

                    </Link>

                    {/* Admin + Owner */}

                    {(isOwner || isAdmin) && (

                        <Link
                            to={`/servers/${currentServer.id}/channels/create`}
                            onClick={() =>
                                setMenuOpen(false)
                            }
                            className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800"
                        >

                            <Plus size={18} />

                            Create Channel

                        </Link>

                    )}

                    {/* Owner */}

                    {isOwner && (

                        <Link
                            to={`/servers/${currentServer.id}/settings`}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800"
                        >

                            <Settings size={18} />

                            Server Settings

                        </Link>

                    )}

                    <div className="my-1 border-t border-zinc-700" />

                    {/* Everyone */}

                    <button
                        onClick={leaveServer}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800"
                    >

                        <LogOut size={18} />

                        Leave Server

                    </button>

                    {/* Owner */}

                    {isOwner && (

                        <button
                            onClick={deleteServer}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-900/20"
                        >

                            <Trash2 size={18} />

                            Delete Server

                        </button>

                    )}

                </div>

            )}
        </div>

        {/* ==========================
            Channels
        ========================== */}

        <div className="flex-1 overflow-y-auto px-2 py-3">

            <div className="mb-2 flex items-center justify-between px-2">

                <span className="text-xs font-bold uppercase tracking-wide text-zinc-500">

                    TEXT CHANNELS

                </span>

                {(isOwner || isAdmin) && (

                    <Link
                        to={`/servers/${currentServer.id}/channels/create`}
                        className="rounded p-1 hover:bg-zinc-700"
                    >

                        <Plus size={15} />

                    </Link>

                )}

            </div>

            {loading && (

                <div className="px-3 py-2 text-sm text-zinc-500">

                    Loading channels...

                </div>

            )}

            {!loading &&
                channels.map(
                    (channel) => {

                        const active =
                            location.pathname ===
                            `/channels/${channel.id}`;

                        return (

                            <Link
                                key={channel.id}
                                to={`/channels/${channel.id}`}
                                className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2 transition ${
                                    active
                                        ? "bg-indigo-600 text-white"
                                        : "text-zinc-400 hover:bg-zinc-700 hover:text-white"
                                }`}
                            >

                                <Hash size={18} />

                                <span className="truncate">

                                    {channel.name}

                                </span>

                            </Link>

                        );

                    }
                )}

            {!loading &&
                channels.length === 0 && (

                    <div className="rounded-lg bg-zinc-900 p-4 text-center text-sm text-zinc-500">

                        No channels yet

                    </div>

                )}

            <div className="mt-6 mb-2 px-2">

                <span className="text-xs font-bold uppercase tracking-wide text-zinc-500">

                    VOICE CHANNELS

                </span>

            </div>

            <div className="flex items-center gap-3 rounded-md px-3 py-2 text-zinc-600">

                <Volume2 size={18} />

                Coming Soon

            </div>

        </div>
                    {/* ==========================
                Footer
            ========================== */}

            <div className="border-t border-zinc-800 p-4">

                <div className="rounded-xl bg-zinc-900 p-4">

                    <div className="flex items-center justify-between">

                        <div>

                            <div className="text-sm font-semibold text-white">

                                {currentServer.name}

                            </div>

                            <div className="mt-1 text-xs text-zinc-400">

                                {channels.length} Text Channels

                            </div>

                        </div>

                        <Hash
                            size={20}
                            className="text-zinc-500"
                        />

                    </div>

                </div>

            </div>

        </aside>

    );

};

export default ChannelSidebar;