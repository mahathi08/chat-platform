import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Crown,
    Shield,
    Search,
} from "lucide-react";

import api from "../../services/api";
import { useServer } from "../../contexts/ServerContext";

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

const MemberSidebar = () => {

    const { currentServer } =
        useServer();

    const [members, setMembers] =
        useState<Member[]>([]);

    const [search, setSearch] =
        useState("");

    useEffect(() => {

        if (!currentServer) {

            setMembers([]);

            return;

        }

        loadMembers();

    }, [currentServer]);

    const loadMembers = async () => {

        if (!currentServer) return;

        try {

            const response =
                await api.get(
                    `/servers/${currentServer.id}/members`
                );

            setMembers(
                response.data.members ??
                response.data
            );

        } catch (err) {

            console.error(err);

        }

    };

    const filtered =
        useMemo(() => {

            return members.filter((m) =>
                m.user.username
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
            );

        }, [members, search]);

    const online =
        filtered.filter(
            (m) =>
                m.user.status ===
                "ONLINE"
        );

    const offline =
        filtered.filter(
            (m) =>
                m.user.status !==
                "ONLINE"
        );

    if (!currentServer) {

        return null;

    }

    return (

        <aside className="hidden w-72 border-l border-zinc-800 bg-[#2B2D31] lg:flex lg:flex-col">

            <div className="border-b border-zinc-800 p-4">

                <h2 className="font-bold text-white">

                    Members

                </h2>

                <p className="text-xs text-zinc-400">

                    {online.length}
                    {" "}
                    Online •
                    {" "}
                    {members.length}
                    {" "}
                    Total

                </p>

            </div>

            <div className="p-3">

                <div className="relative">

                    <Search
                        size={16}
                        className="absolute left-3 top-3 text-zinc-500"
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search members"
                        className="w-full rounded-md bg-zinc-900 py-2 pl-9 pr-3 text-sm text-white outline-none"
                    />

                </div>

            </div>

            <div className="flex-1 overflow-y-auto">

                <div className="px-4 pb-2 text-xs font-bold uppercase tracking-wide text-zinc-500">

                    ONLINE —
                    {" "}
                    {online.length}

                </div>

                {online.map((member) => (

                    <MemberCard
                        key={member.id}
                        member={member}
                    />

                ))}

                <div className="mt-5 px-4 pb-2 text-xs font-bold uppercase tracking-wide text-zinc-500">

                    OFFLINE —
                    {" "}
                    {offline.length}

                </div>

                {offline.map((member) => (

                    <MemberCard
                        key={member.id}
                        member={member}
                    />

                ))}

            </div>

        </aside>

    );

};

function MemberCard({
    member,
}: {
    member: Member;
}) {

    return (

        <div className="mx-2 mb-1 flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 hover:bg-zinc-700">

            <div className="relative">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">

                    {member.user.username
                        .charAt(0)
                        .toUpperCase()}

                </div>

                <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#2B2D31] ${
                        member.user.status ===
                        "ONLINE"
                            ? "bg-green-500"
                            : "bg-gray-500"
                    }`}
                />

            </div>

            <div className="min-w-0 flex-1">

                <div className="truncate text-sm font-medium text-white">

                    {member.user.username}

                </div>

                <div className="text-xs text-zinc-400">

                    {member.role}

                </div>

            </div>

            {member.role ===
                "OWNER" && (

                <Crown
                    size={16}
                    className="text-yellow-400"
                />

            )}

            {member.role ===
                "ADMIN" && (

                <Shield
                    size={16}
                    className="text-blue-400"
                />

            )}

        </div>

    );

}

export default MemberSidebar;