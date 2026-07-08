import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    Users,
    ArrowRight,
} from "lucide-react";

import inviteService from "../../services/invite.service";
import { useServer } from "../../contexts/ServerContext";

import type { Invite } from "../../services/invite.service";

const JoinServerPage = () => {

    const { code } = useParams();

    const navigate = useNavigate();

    const { refreshServers } =
        useServer();

    const [invite, setInvite] =
        useState<Invite | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [joining, setJoining] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {

        if (!code)
            return;

        loadInvite();

    }, [code]);

    const loadInvite = async () => {

        try {

            const data =
                await inviteService.getInvite(
                    code!
                );

            setInvite(data);

        } catch (err: any) {

            setError(
                err.response?.data?.detail ??
                "Invalid invite."
            );

        } finally {

            setLoading(false);

        }

    };

    const join = async () => {

        if (!invite)
            return;

        try {

            setJoining(true);

            const response =
                await inviteService.joinInvite(
                    invite.code
                );

            await refreshServers();

            navigate(
                `/servers/${response.server_id}`
            );

        } catch (err: any) {

            alert(
                err.response?.data?.detail ??
                "Unable to join."
            );

        } finally {

            setJoining(false);

        }

    };

    if (loading) {

        return (

            <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">

                Loading...

            </div>

        );

    }

    if (!invite) {

        return (

            <div className="flex h-screen items-center justify-center bg-zinc-950">

                <div className="rounded-xl bg-zinc-900 p-8 text-center">

                    <h1 className="mb-3 text-2xl font-bold text-white">

                        Invalid Invite

                    </h1>

                    <p className="text-zinc-400">

                        {error}

                    </p>

                </div>

            </div>

        );

    }

    return (

        <div className="flex h-screen items-center justify-center bg-zinc-950">

            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-3xl font-bold text-white">

                    {invite.server?.name
                        ?.charAt(0)
                        ?.toUpperCase()}

                </div>

                <h1 className="text-center text-3xl font-bold text-white">

                    {invite.server?.name}

                </h1>

                <p className="mt-3 text-center text-zinc-400">

                    {invite.server?.description ||
                        "No description"}

                </p>

                <div className="mt-8 rounded-lg bg-zinc-950 p-4">

                    <div className="flex items-center gap-3 text-zinc-300">

                        <Users size={18} />

                        Invite Code

                    </div>

                    <div className="mt-2 font-mono text-indigo-400">

                        {invite.code}

                    </div>

                </div>

                <button
                    onClick={join}
                    disabled={joining}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                >

                    {joining
                        ? "Joining..."
                        : "Join Server"}

                    <ArrowRight size={18} />

                </button>

            </div>

        </div>

    );

};

export default JoinServerPage;