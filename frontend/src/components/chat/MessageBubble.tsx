import type { Message } from "../../types/message";

interface MessageBubbleProps {
    message: Message;
}

const MessageBubble = ({
    message,
}: MessageBubbleProps) => {

    return (

        <div className="group flex gap-3 px-5 py-3 transition hover:bg-zinc-800">

            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">

                {message.author?.username?.charAt(0).toUpperCase() ?? "U"}

            </div>

            <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-2">

                    <span className="font-semibold text-white">

                        {message.author?.username ??
                            `User ${message.author_id}`}

                    </span>

                    <span className="text-xs text-zinc-500">

                        {new Date(
                            message.created_at
                        ).toLocaleString()}

                    </span>

                    {message.is_pinned && (

                        <span className="rounded bg-yellow-600 px-2 py-0.5 text-xs font-medium text-white">

                            📌 Pinned

                        </span>

                    )}

                    {message.is_edited && (

                        <span className="text-xs italic text-zinc-500">

                            edited

                        </span>

                    )}

                    {message.is_deleted && (

                        <span className="text-xs text-red-400">

                            deleted

                        </span>

                    )}

                </div>

                <div className="mt-2 whitespace-pre-wrap break-words text-zinc-200">

                    {message.content}

                </div>

            </div>

        </div>

    );

};

export default MessageBubble;