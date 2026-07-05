import { Message } from "../../types/message";

interface Props {
    message: Message;
}

const MessageBubble = ({ message }: Props) => {
    return (
        <div className="flex gap-3 px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">

                {message.author?.username?.[0]?.toUpperCase() ?? "U"}

            </div>

            <div className="flex-1">

                <div className="flex items-center gap-3">

                    <span className="font-semibold">

                        {message.author?.username ??
                            `User ${message.author_id}`}

                    </span>

                    <span className="text-xs text-gray-500">

                        {new Date(
                            message.created_at
                        ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}

                    </span>

                    {message.is_pinned && (
                        <span className="rounded bg-yellow-200 px-2 py-0.5 text-xs">
                            PINNED
                        </span>
                    )}

                    {message.is_edited && (
                        <span className="text-xs text-gray-400">
                            edited
                        </span>
                    )}

                </div>

                <p className="mt-1 whitespace-pre-wrap">

                    {message.content}

                </p>

            </div>

        </div>
    );
};

export default MessageBubble;