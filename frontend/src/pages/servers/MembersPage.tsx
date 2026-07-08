import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
    Crown,
    Shield,
    User,
    ArrowUp,
    ArrowDown,
    Trash2,
    Repeat,
    Search,
    RefreshCw,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import serverService from "../../services/server.service";

interface Member {
    id: number;
    role: string;
    joined_at: string;

    user: {
        id: number;
        username: string;
        avatar_url?: string;
    };
}

const roleOrder: Record<string, number> = {
    OWNER: 0,
    ADMIN: 1,
    MEMBER: 2,
};

const MembersPage = () => {

    const { serverId } = useParams();
    const { user } = useAuth();

    const [members, setMembers] =
        useState<Member[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const loadMembers = async () => {

        if (!serverId) return;

        setLoading(true);

        try {

            const response =
                await serverService.getMembers(
                    Number(serverId)
                );

            const list =
                response.members ??
                response;

            setMembers(list);

            setError("");

        } catch (err: any) {

            setError(
                err?.response?.data?.detail ??
                "Unable to load members."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadMembers();

    }, [serverId]);

    const promote = async (
        userId: number,
    ) => {

        if (
            !window.confirm(
                "Promote this member?"
            )
        ) {
            return;
        }

        await serverService.promoteMember(
            Number(serverId),
            userId,
        );

        loadMembers();

    };

    const demote = async (
        userId: number,
    ) => {

        if (
            !window.confirm(
                "Demote this member?"
            )
        ) {
            return;
        }

        await serverService.demoteMember(
            Number(serverId),
            userId,
        );

        loadMembers();

    };

    const kick = async (
        userId: number,
    ) => {

        if (
            !window.confirm(
                "Kick this member?"
            )
        ) {
            return;
        }

        await serverService.kickMember(
            Number(serverId),
            userId,
        );

        loadMembers();

    };

    const transfer = async (
        userId: number,
    ) => {

        if (
            !window.confirm(
                "Transfer ownership?\n\nThis cannot be undone."
            )
        ) {
            return;
        }

        await serverService.transferOwnership(
            Number(serverId),
            userId,
        );

        loadMembers();

    };

    const filteredMembers =
        useMemo(() => {

            return [...members]

                .sort(
                    (a, b) =>
                        roleOrder[a.role] -
                        roleOrder[b.role]
                )

                .filter(
                    (member) =>
                        member.user.username
                            .toLowerCase()
                            .includes(
                                search.toLowerCase()
                            )
                );

        }, [members, search]);

    const myMember = members.find(
        (m) => m.user.id === user?.id
    );

    const isOwner =
        myMember?.role === "OWNER";

    const isAdmin =
        myMember?.role === "ADMIN";

    const roleBadge = (
        role: string,
    ) => {

        switch (role) {

            case "OWNER":

                return (

                    <span className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-400">

                        <Crown size={14}/>

                        Owner

                    </span>

                );

            case "ADMIN":

                return (

                    <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-400">

                        <Shield size={14}/>

                        Admin

                    </span>

                );

            default:

                return (

                    <span className="flex items-center gap-1 rounded-full bg-zinc-700 px-3 py-1 text-xs text-zinc-300">

                        <User size={14}/>

                        Member

                    </span>

                );

        }

    };

        if (loading) {

        return (

            <div className="flex h-full items-center justify-center bg-zinc-900 text-white">

                Loading members...

            </div>

        );

    }

    return (

        <div className="h-full overflow-y-auto bg-zinc-900">

            <div className="mx-auto max-w-6xl p-8">

                {/* Header */}

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <h1 className="text-3xl font-bold text-white">

                            Members

                        </h1>

                        <p className="mt-2 text-zinc-400">

                            {members.length} member{members.length !== 1 && "s"}

                        </p>

                    </div>

                    <button
                        onClick={loadMembers}
                        className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-white transition hover:bg-zinc-700"
                    >

                        <RefreshCw size={18} />

                        Refresh

                    </button>

                </div>

                {/* Search */}

                <div className="relative mb-8">

                    <Search
                        size={18}
                        className="absolute left-4 top-3.5 text-zinc-500"
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search members..."
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-11 pr-4 text-white outline-none transition focus:border-indigo-500"
                    />

                </div>

                {error && (

                    <div className="mb-6 rounded-xl border border-red-700 bg-red-900/20 p-4 text-red-300">

                        {error}

                    </div>

                )}

                {filteredMembers.length === 0 ? (

                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-12 text-center text-zinc-500">

                        No members found.

                    </div>

                ) : (

                    <div className="space-y-4">

                        {filteredMembers.map((member) => (

                            <div
                                key={member.id}
                                className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-indigo-600"
                            >

                                <div className="flex items-center gap-4">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white">

                                        {member.user.username
                                            .charAt(0)
                                            .toUpperCase()}

                                    </div>

                                    <div>

                                        <div className="text-lg font-semibold text-white">

                                            {member.user.username}

                                        </div>

                                        <div className="mt-2">

                                            {roleBadge(member.role)}

                                        </div>

                                        <div className="mt-2 text-xs text-zinc-500">

                                            Joined{" "}

                                            {new Date(
                                                member.joined_at
                                            ).toLocaleDateString()}

                                        </div>

                                    </div>

                                </div>

                                <div className="flex flex-wrap gap-2">

                                    {/* OWNER */}

                                    {isOwner && member.role !== "OWNER" && (

                                        <>

                                            {member.role === "MEMBER" && (

                                                <button
                                                    onClick={() =>
                                                        promote(member.user.id)
                                                    }
                                                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-500"
                                                >
                                                    <ArrowUp size={16} />
                                                    Promote
                                                </button>

                                            )}

                                            {member.role === "ADMIN" && (

                                                <button
                                                    onClick={() =>
                                                        demote(member.user.id)
                                                    }
                                                    className="flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-500"
                                                >
                                                    <ArrowDown size={16} />
                                                    Demote
                                                </button>

                                            )}

                                            <button
                                                onClick={() =>
                                                    transfer(member.user.id)
                                                }
                                                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
                                            >
                                                <Repeat size={16} />
                                                Transfer
                                            </button>

                                            <button
                                                onClick={() =>
                                                    kick(member.user.id)
                                                }
                                                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-500"
                                            >
                                                <Trash2 size={16} />
                                                Kick
                                            </button>

                                        </>

                                    )}

                                    {/* ADMIN */}

                                    {!isOwner &&
                                        isAdmin &&
                                        member.role === "MEMBER" && (

                                        <button
                                            onClick={() =>
                                                kick(member.user.id)
                                            }
                                            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-500"
                                        >
                                            <Trash2 size={16} />
                                            Kick
                                        </button>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

};

export default MembersPage;