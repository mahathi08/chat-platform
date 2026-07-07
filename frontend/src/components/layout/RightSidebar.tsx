import { useEffect, useState } from "react";

import { useServer } from "../../contexts/ServerContext";
import api from "../../services/api";

interface Member {
    id: number;
    role: string;
    joined_at: string;

    user: {
        id: number;
        username: string;
        avatar_url?: string;
        status?: string;
    };
}

const RightSidebar = () => {
    const { currentServer } = useServer();

    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!currentServer) {
            setMembers([]);
            return;
        }

        loadMembers();
    }, [currentServer]);

    const loadMembers = async () => {
        if (!currentServer) return;

        setLoading(true);

        try {
            const response = await api.get(
                `/servers/${currentServer.id}/members`
            );

            setMembers(response.data.members ?? response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <aside className="hidden w-72 border-l border-zinc-800 bg-zinc-950 lg:block">
            <div className="border-b border-zinc-800 p-5">
                <h2 className="text-lg font-bold text-white">
                    Members
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                    {members.length} member
                    {members.length !== 1 ? "s" : ""}
                </p>
            </div>

            <div className="overflow-y-auto">
                {loading && (
                    <div className="p-4 text-zinc-400">
                        Loading...
                    </div>
                )}

                {!loading &&
                    members.map((member) => {
                        const username =
                            member.user?.username ?? "Unknown";

                        const status =
                            member.user?.status ?? "OFFLINE";

                        return (
                            <div
                                key={member.id}
                                className="flex items-center gap-3 border-b border-zinc-900 px-4 py-3 hover:bg-zinc-900"
                            >
                                <div className="relative">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                                        {username
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <span
                                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-950 ${
                                            status === "ONLINE"
                                                ? "bg-green-500"
                                                : status === "AWAY"
                                                ? "bg-yellow-400"
                                                : status === "BUSY"
                                                ? "bg-red-500"
                                                : "bg-gray-500"
                                        }`}
                                    />
                                </div>

                                <div className="flex-1">
                                    <div className="font-medium text-white">
                                        {username}
                                    </div>

                                    <div className="text-xs text-zinc-400">
                                        {member.role}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                {!loading && members.length === 0 && (
                    <div className="p-6 text-center text-zinc-500">
                        No members found.
                    </div>
                )}
            </div>
        </aside>
    );
};

export default RightSidebar;