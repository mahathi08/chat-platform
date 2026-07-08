import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowRight,
    Link2,
    AlertCircle,
} from "lucide-react";

import api from "../../services/api";
import { useServer } from "../../contexts/ServerContext";

const JoinServer = () => {

    const navigate = useNavigate();

    const { refreshServers } =
        useServer();

    const [inviteCode, setInviteCode] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const joinServer = async () => {

        const code =
            inviteCode.trim();

        if (!code) {

            setError(
                "Please enter an invite code."
            );

            return;

        }

        setLoading(true);
        setError("");

        try {

            const response =
                await api.post(
                    `/invites/${code}/join`
                );

            await refreshServers();

            navigate(
                `/servers/${response.data.server_id}`
            );

        }

        catch (err: any) {

            setError(

                err?.response?.data?.detail ??

                "Unable to join server."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="flex h-full items-center justify-center bg-[#313338]">

            <div className="w-full max-w-xl rounded-2xl bg-[#1E1F22] p-10 shadow-2xl">

                <div className="mb-8 text-center">

                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600">

                        <Link2
                            size={30}
                            className="text-white"
                        />

                    </div>

                    <h1 className="text-3xl font-bold text-white">

                        Join a Server

                    </h1>

                    <p className="mt-3 text-zinc-400">

                        Enter an invite code shared by
                        another member.

                    </p>

                </div>

                <div>

                    <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-zinc-400">

                        Invite Code

                    </label>

                    <input
                        value={inviteCode}
                        onChange={(e) =>
                            setInviteCode(
                                e.target.value
                            )
                        }
                        placeholder="e.g. MfG0W7OktkA"
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 text-white outline-none transition focus:border-indigo-500"
                    />

                </div>

                {error && (

                    <div className="mt-5 flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-red-400">

                        <AlertCircle size={18} />

                        {error}

                    </div>

                )}

                <button
                    onClick={joinServer}
                    disabled={loading}
                    className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 py-4 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >

                    {loading
                        ? "Joining..."
                        : "Join Server"}

                    <ArrowRight size={18} />

                </button>

            </div>

        </div>

    );

};

export default JoinServer;