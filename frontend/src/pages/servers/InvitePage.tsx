import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import {
    Copy,
    Plus,
    Trash2,
    Check,
} from "lucide-react";
import inviteService from "../../services/invite.service";
import type { Invite } from "../../services/invite.service";
import useAuth from "../../hooks/useAuth";
import serverService from "../../services/server.service";

const InvitePage = () => {

    const { serverId } = useParams();
    const { user } = useAuth();

    const [invites, setInvites] =
        useState<Invite[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [copied, setCopied] =
        useState("");
    const [myRole, setMyRole] =
        useState("");

    const isOwner =
        myRole === "OWNER";

    const isAdmin =
        myRole === "ADMIN";

    const canManageInvites =
        isOwner || isAdmin;

    useEffect(() => {

        if (serverId) {

            loadInvites();

        }

    }, [serverId]);

    const loadInvites = async () => {

        setLoading(true);

        try {

            const response =
                await inviteService.getServerInvites(
                    Number(serverId)
                );

            setInvites(
                response.invites ??
                response
            );
            const members =
                await serverService.getMembers(
                    Number(serverId)
                );

            const list =
                members.members ??
                members;

            const me =
                list.find(
                    (m: any) =>
                        m.user.id === user?.id
                );

            setMyRole(
                me?.role ?? ""
            );

        } finally {

            setLoading(false);

        }

    };

    const createInvite = async () => {

        await inviteService.createInvite(
            Number(serverId)
        );

        loadInvites();

    };

    const revokeInvite = async (
        code: string,
    ) => {

        if (
            !confirm(
                "Revoke this invite?"
            )
        ) return;

        await inviteService.revokeInvite(
            code
        );

        loadInvites();

    };

    const copyInvite = async (
        code: string,
    ) => {

        await navigator.clipboard.writeText(
            `${window.location.origin}/invite/${code}`
        );

        setCopied(code);

        setTimeout(() => {

            setCopied("");

        }, 2000);

    };

    if (loading) {

        return (

            <div className="flex h-full items-center justify-center bg-zinc-950 text-zinc-400">

                Loading invites...

            </div>

        );

    }

    return (

        <div className="h-full overflow-y-auto bg-zinc-950 p-8">

            <div className="mx-auto max-w-5xl">

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <h1 className="text-3xl font-bold text-white">

                            Invite People

                        </h1>

                        <p className="mt-2 text-zinc-400">

                            Generate invite links to allow others to join this server.

                        </p>

                    </div>

                    {canManageInvites && (

                        <button
                            onClick={createInvite}
                            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500"
                        >

                            <Plus size={18} />

                            Create Invite

                        </button>

                    )}

                </div>

                {invites.length === 0 && (

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-10 text-center text-zinc-500">

                        No active invites.

                    </div>

                )}

                <div className="space-y-5">

                    {invites.map((invite) => (

                        <div
                            key={invite.code}
                            className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
                        >

                            <div className="flex items-center justify-between">

                                <div className="space-y-3">

                                    <div className="font-mono text-lg text-indigo-400">

                                        {invite.code}

                                    </div>

                                    <div className="flex gap-6 text-sm text-zinc-400">

                                        <span>

                                            Status:
                                            {" "}
                                            {invite.status}

                                        </span>

                                        <span>

                                            Uses:
                                            {" "}
                                            {invite.uses}

                                            {invite.max_uses > 0 &&
                                                ` / ${invite.max_uses}`}

                                        </span>

                                    </div>

                                    <div className="text-sm text-zinc-500">

                                        {invite.expires_at
                                            ? `Expires ${new Date(invite.expires_at).toLocaleString()}`
                                            : "Never expires"}

                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    <button
                                        onClick={() =>
                                            copyInvite(invite.code)
                                        }
                                        className="rounded-lg bg-zinc-800 p-3 transition hover:bg-zinc-700"
                                    >

                                        {copied === invite.code
                                            ? <Check size={18}/>
                                            : <Copy size={18}/>}

                                    </button>

                                    {canManageInvites &&
                                        invite.status === "ACTIVE" && (

                                        <button
                                            onClick={() =>
                                                revokeInvite(invite.code)
                                            }
                                            className="rounded-lg bg-red-600 p-3 transition hover:bg-red-500"
                                        >

                                            <Trash2 size={18} />

                                        </button>

                                    )}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

};

export default InvitePage;