import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../../services/api";

import Button from "../../components/common/Button";

interface Invite {
    code: string;
    uses: number;
    max_uses: number | null;
    expires_at: string | null;
}

const InvitePage = () => {

    const { serverId } = useParams();

    const [
        invites,
        setInvites,
    ] = useState<Invite[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    useEffect(() => {

        if (serverId) {

            loadInvites();

        }

    }, [serverId]);

    const loadInvites = async () => {

        try {

            const response =
                await api.get(
                    `/invites/servers/${serverId}`
                );

            setInvites(
                response.data.invites ??
                response.data
            );

        } catch (err: any) {

            setError(
                err?.response?.data?.detail ??
                "Unable to load invites."
            );

        } finally {

            setLoading(false);

        }

    };

    const createInvite = async () => {

        try {

            await api.post(
                `/invites/servers/${serverId}`,
                {
                    expires_at: null,
                    max_uses: null,
                }
            );

            loadInvites();

        } catch (err: any) {

            alert(
                err?.response?.data?.detail ??
                "Failed to create invite."
            );

        }

    };

    const revokeInvite = async (
        code: string
    ) => {

        if (
            !confirm(
                "Revoke this invite?"
            )
        ) {
            return;
        }

        await api.delete(
            `/invites/${code}`
        );

        loadInvites();

    };

    if (loading) {

        return (

            <div className="flex h-full items-center justify-center bg-zinc-900 text-white">

                Loading invites...

            </div>

        );

    }

    return (

        <div className="h-full overflow-y-auto bg-zinc-900 p-8">

            <div className="mx-auto max-w-5xl">

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <h1 className="text-3xl font-bold text-white">

                            Server Invites

                        </h1>

                        <p className="mt-2 text-zinc-400">

                            Create and manage invite links.

                        </p>

                    </div>

                    <Button
                        onClick={createInvite}
                    >
                        Create Invite
                    </Button>

                </div>

                {error && (

                    <div className="mb-6 rounded-lg bg-red-900/30 p-3 text-red-300">

                        {error}

                    </div>

                )}

                <div className="space-y-4">

                    {invites.map((invite) => (

                        <div
                            key={invite.code}
                            className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <div className="font-mono text-lg text-blue-400">

                                        {invite.code}

                                    </div>

                                    <div className="mt-2 text-sm text-zinc-400">

                                        Uses:
                                        {" "}
                                        {invite.uses}

                                        {invite.max_uses &&
                                            ` / ${invite.max_uses}`}

                                    </div>

                                    <div className="text-sm text-zinc-500">

                                        {invite.expires_at
                                            ? `Expires: ${new Date(invite.expires_at).toLocaleString()}`
                                            : "No expiration"}

                                    </div>

                                </div>

                                <button
                                    onClick={() =>
                                        revokeInvite(
                                            invite.code
                                        )
                                    }
                                    className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                                >

                                    Revoke

                                </button>

                            </div>

                        </div>

                    ))}

                    {invites.length === 0 && (

                        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-10 text-center text-zinc-500">

                            No active invites.

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

};

export default InvitePage;