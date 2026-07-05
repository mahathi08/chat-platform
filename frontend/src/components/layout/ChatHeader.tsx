import { Hash, Users } from "lucide-react";

interface Props {
    channelName?: string;
    description?: string;
}

const ChatHeader = ({
    channelName = "general",
    description = "",
}: Props) => {
    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-950">

            <div>

                <div className="flex items-center gap-2">

                    <Hash size={20} />

                    <h2 className="text-xl font-semibold">

                        {channelName}

                    </h2>

                </div>

                {description && (
                    <p className="text-sm text-gray-500">

                        {description}

                    </p>
                )}

            </div>

            <button
                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <Users size={20} />
            </button>

        </header>
    );
};

export default ChatHeader;