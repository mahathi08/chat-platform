import {
    Hash,
    Users,
    Search,
    Bell,
    Pin,
} from "lucide-react";

interface ChatHeaderProps {
    channelName?: string;
    description?: string;
}

const ChatHeader = ({
    channelName = "general",
    description,
}: ChatHeaderProps) => {
    return (
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6">

            <div className="flex items-center gap-3">

                <Hash
                    size={22}
                    className="text-zinc-400"
                />

                <div>

                    <h2 className="font-semibold text-white">

                        {channelName}

                    </h2>

                    {description && (
                        <p className="text-sm text-zinc-400">

                            {description}

                        </p>
                    )}

                </div>

            </div>

            <div className="flex items-center gap-2">

                {/* <button
                    className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                    title="Search"
                >
                    <Search size={20} />
                </button>

                <button
                    className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                    title="Pinned Messages"
                >
                    <Pin size={20} />
                </button>

                <button
                    className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                    title="Notifications"
                >
                    <Bell size={20} />
                </button> */}

                {/* <button
                    className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                    title="Members"
                >
                    <Users size={20} />
                </button> */}

            </div>

        </header>
    );
};

export default ChatHeader;