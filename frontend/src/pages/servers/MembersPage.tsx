import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../../services/api";

interface Member {
    id: number;
    username: string;
    avatar_url?: string;
    role: string;
}

const MembersPage = () => {

    const { serverId } = useParams();

    const [
        members,
        setMembers,
    ] = useState<Member[]>([]);

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

            loadMembers();

        }

    }, [serverId]);

    const loadMembers = async () => {

        try {

            const response =
                await api.get(
                    `/servers/${serverId}/members`
                );

            setMembers(
                response.data.members ??
                response.data
            );

        } catch (err: any) {

            setError(
                err?.response?.data?.detail ??
                "Unable to load members."
            );

        } finally {

            setLoading(false);

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

        <div className="h-full overflow-y-auto bg-zinc-900 p-8">

            <div className="mx-auto max-w-4xl">

                <h1 className="mb-8 text-3xl font-bold text-white">

                    Server Members

                </h1>

                {error && (

                    <div className="mb-6 rounded-lg bg-red-900/40 p-3 text-red-300">

                        {error}

                    </div>

                )}

                <div className="space-y-3">

                    {members.map((member) => (

                        <div
                            key={member.id}
                            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                        >

                            <div className="flex items-center gap-4">

                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">

                                    {member.username
                                        .charAt(0)
                                        .toUpperCase()}

                                </div>

                                <div>

                                    <div className="font-semibold text-white">

                                        {member.username}

                                    </div>

                                    <div className="text-sm text-zinc-400">

                                        {member.role}

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                    {members.length === 0 && (

                        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-10 text-center text-zinc-500">

                            No members found.

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

};

export default MembersPage;