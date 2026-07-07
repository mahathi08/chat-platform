import { useEffect, useState } from "react";

import {
    Link,
    useLocation,
    useParams,
} from "react-router-dom";

import serverService from "../../services/server.service";
import channelService from "../../services/channel.service";

import type {
    Server,
} from "../../types/server";

import type {
    Channel,
} from "../../types/channel";



import { useServer } from "../../contexts/ServerContext";

const ServerPage = () => {

    const { serverId } = useParams();
    const location = useLocation();
    const {
        currentServer,
        setCurrentServer,
    } = useServer();

    const [
        server,
        setServer,
    ] = useState<Server | null>(
        currentServer
    );

    const [
        channels,
        setChannels,
    ] = useState<Channel[]>(
        []
    );

    const [
        loading,
        setLoading,
    ] = useState(true);

    useEffect(() => {

        if (!serverId)
            return;

        load();

    }, [serverId]);

    const load = async () => {

        try {

            const s =
                await serverService.getServer(
                    Number(serverId)
                );

            setServer(s);

            setCurrentServer(s);

            const c =
                await channelService.getServerChannels(
                    Number(serverId)
                );

            setChannels(
                c.channels ?? c
            );

        }
        catch (err) {

            console.error(err);

        }
        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (
            <div className="flex h-full items-center justify-center bg-zinc-900 text-white">
                Loading server...
            </div>
        );

    }

    if (!server) {

        return (
            <div className="flex h-full items-center justify-center bg-zinc-900 text-white">
                Server not found.
            </div>
        );

    }

    return (

        <div className="flex h-full bg-zinc-900">

            <div className="w-72 border-r border-zinc-800 bg-zinc-950">

                <div className="border-b border-zinc-800 p-5">

                    <h1 className="text-xl font-bold">
                        {server.name}
                    </h1>

                    <p className="mt-2 text-sm text-zinc-400">

                        {server.description ||
                            "No description"}

                    </p>

                </div>

                <div className="p-4">

                    <div className="mb-4 flex items-center justify-between">

                        <h2 className="font-semibold">
                            Channels
                        </h2>

                        <Link
                            to={`/servers/${server.id}/channels/create`}
                            className="text-blue-500 hover:underline"
                        >
                            +
                        </Link>

                    </div>

                    <div className="space-y-2">

                        {channels.map(
                            (
                                channel
                            ) => (

                                <Link
                                    key={
                                        channel.id
                                    }
                                    to={`/channels/${channel.id}`}
                                    className={`block rounded-lg p-3 transition ${
                                                location.pathname ===
                                                `/channels/${channel.id}`
                                                    ? "bg-blue-600 text-white"
                                                    : "hover:bg-zinc-800"
                                            }`}
                                >
                                    # {channel.name}
                                </Link>

                            )
                        )}

                        {channels.length ===
                            0 && (
                            <div className="text-sm text-zinc-500">
                                No channels yet.
                            </div>
                        )}

                    </div>

                </div>

            </div>

            <div className="flex flex-1 items-center justify-center">

                <div className="text-center">

                    <h2 className="mb-4 text-3xl font-bold">

                        {server.name}

                    </h2>

                    <p className="text-zinc-400">

                        Select a channel from the left to begin chatting.

                    </p>

                </div>

            </div>

        </div>

    );

};

export default ServerPage;