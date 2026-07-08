import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import useAuth from "../../hooks/useAuth";
import serverService from "../../services/server.service";
import channelService from "../../services/channel.service";

const CreateChannel = () => {
    const { serverId } = useParams();
    const { user } = useAuth();

    const navigate = useNavigate();

    const [name, setName] = useState("");

    const [description, setDescription] =
        useState("");

    const [creating, setCreating] =
        useState(false);

    const [error, setError] =
        useState("");
    const [myRole, setMyRole] =
        useState("");
    const canCreate =
        myRole === "OWNER" ||
        myRole === "ADMIN";

    const [checkingRole, setCheckingRole] =
        useState(true);

    useEffect(() => {

            const loadRole = async () => {

                if (!serverId)
                    return;

                try {

                    const response =
                        await serverService.getMembers(
                            Number(serverId)
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

                }finally {
                    setCheckingRole(false);
                }

            };

            loadRole();

        }, [serverId, user]);

    const submit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!serverId) return;
        if (!canCreate) {
            return;
        }
        if (!name.trim()) {
            setError("Channel name is required.");
            return;
        }

        try {

            setCreating(true);

            const channel =
                await channelService.createChannel(
                    Number(serverId),
                    {
                        name,
                        description,
                        type: "TEXT",
                        position: 0,
                        topic: "",
                        is_private: false,
                    }
                );

            navigate(`/channels/${channel.id}`);

        } catch (err: any) {

            setError(
                err?.response?.data?.detail ??
                "Unable to create channel."
            );

        } finally {

            setCreating(false);

        }

    };
    if (checkingRole) {

        return (

            <div className="flex h-full items-center justify-center bg-zinc-950 text-white">

                Checking permissions...

            </div>

        );

    }
    if (!canCreate) {

        return (

            <div className="flex h-full items-center justify-center bg-zinc-950">

                <div className="rounded-2xl border border-red-700 bg-zinc-900 p-10 text-center">

                    <div className="text-6xl font-bold text-red-500">

                        403

                    </div>

                    <h1 className="mt-4 text-2xl font-bold text-white">

                        Permission Denied

                    </h1>

                    <p className="mt-3 text-zinc-400">

                        You don't have permission to create channels.

                    </p>

                </div>

            </div>

        );

    }

    return (

        <div className="flex h-full items-center justify-center bg-zinc-950">

            <form
                onSubmit={submit}
                className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
            >

                <h1 className="mb-6 text-3xl font-bold text-white">

                    Create Channel

                </h1>

                {error && (

                    <div className="mb-5 rounded-lg bg-red-600/10 p-3 text-red-400">

                        {error}

                    </div>

                )}

                <div className="mb-5">

                    <label className="mb-2 block text-sm text-zinc-400">

                        Channel Name

                    </label>

                    <input
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="general"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-indigo-500"
                    />

                </div>

                <div className="mb-6">

                    <label className="mb-2 block text-sm text-zinc-400">

                        Description

                    </label>

                    <textarea
                        rows={4}
                        value={description}
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                        className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-indigo-500"
                    />

                </div>

                <button
                    disabled={creating}
                    className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >

                    {creating
                        ? "Creating..."
                        : "Create Channel"}

                </button>

            </form>

        </div>

    );

};

export default CreateChannel;