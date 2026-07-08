import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import serverService from "../../services/server.service";

const ServerSettings = () => {

    const { serverId } = useParams();

    const navigate = useNavigate();

    const { user } = useAuth();

    const [name, setName] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [myRole, setMyRole] =
        useState("");

    useEffect(() => {

        load();

    }, [serverId]);

    const load = async () => {

        if (!serverId)
            return;

        try {

            const server =
                await serverService.getServer(
                    Number(serverId)
                );

            setName(server.name);

            setDescription(
                server.description ?? ""
            );

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

        catch (err: any) {

            setError(
                err?.response?.data?.detail ??
                "Unable to load server."
            );

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="flex h-full items-center justify-center bg-zinc-950 text-white">

                Loading...

            </div>

        );

    }

    if (myRole !== "OWNER") {

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

                        Only the server owner can access Server Settings.

                    </p>

                </div>

            </div>

        );

    }

    const save = async () => {

        try {

            setSaving(true);

            await serverService.updateServer(
                Number(serverId),
                {
                    name,
                    description,
                }
            );

            alert(
                "Server updated successfully."
            );

        }

        catch (err: any) {

            setError(
                err?.response?.data?.detail ??
                "Unable to update server."
            );

        }

        finally {

            setSaving(false);

        }

    };

    const deleteServer = async () => {

        if (
            !window.confirm(
                "Delete this server permanently?\n\nThis action cannot be undone."
            )
        ) {
            return;
        }

        await serverService.deleteServer(
            Number(serverId)
        );

        navigate("/");

    };

    return (

        <div className="h-full overflow-y-auto bg-zinc-950 p-8">

            <div className="mx-auto max-w-3xl">

                <h1 className="mb-8 text-3xl font-bold text-white">

                    Server Settings

                </h1>

                {error && (

                    <div className="mb-6 rounded-lg bg-red-900/20 p-4 text-red-300">

                        {error}

                    </div>

                )}

                <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

                    <div>

                        <label className="mb-2 block text-sm text-zinc-400">

                            Server Name

                        </label>

                        <input
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-indigo-500"
                        />

                    </div>

                    <div>

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
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-indigo-500"
                        />

                    </div>

                    <div className="flex gap-3">

                        <button
                            onClick={save}
                            disabled={saving}
                            className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                        >

                            {saving
                                ? "Saving..."
                                : "Save Changes"}

                        </button>

                    </div>

                </div>

                <div className="mt-10 rounded-2xl border border-red-700 bg-red-900/10 p-8">

                    <h2 className="text-xl font-bold text-red-400">

                        Danger Zone

                    </h2>

                    <p className="mt-2 text-zinc-400">

                        Deleting a server permanently removes all channels, messages and invites.

                    </p>

                    <button
                        onClick={deleteServer}
                        className="mt-6 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-500"
                    >

                        Delete Server

                    </button>

                </div>

            </div>

        </div>

    );

};

export default ServerSettings;