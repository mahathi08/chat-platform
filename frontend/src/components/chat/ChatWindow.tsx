import {
    MessageCircle,
    Reply,
} from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

import type { Message } from "../../types/message";

interface ChatWindowProps {
    messages: Message[];

    channelName?: string;
    canPin: boolean;
    description?: string;
    isOwner: boolean;

    isAdmin: boolean;
    replyingTo: Message | null;

    // onReply: (message: Message) => void;

    onEdit: (
        id: number,
        content: string
    ) => Promise<void>;

    onDelete: (
        id: number
    ) => Promise<void>;

    onPin: (
        message: Message
    ) => Promise<void>;

    onSend: (
        content: string
    ) => Promise<void>;
}

const ChatWindow = ({
    messages,
    channelName,
    description,

    canPin,
    isOwner,
    isAdmin,

    replyingTo,

    // onReply,
    onEdit,
    onDelete,
    onPin,
    onSend,
}: ChatWindowProps) => {

    return (

        <div className="flex h-full flex-col bg-[#313338]">

            <ChatHeader
                channelName={channelName}
                description={description}
            />

            {/* Empty State */}

            {messages.length === 0 ? (

                <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">

                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600/20">

                        <MessageCircle
                            size={48}
                            className="text-indigo-400"
                        />

                    </div>

                    <h2 className="text-3xl font-bold text-white">

                        Welcome to #

                        {channelName}

                    </h2>

                    <p className="mt-3 max-w-xl text-zinc-400">

                        This is the beginning of the

                        <span className="mx-1 font-semibold text-white">

                            #{channelName}

                        </span>

                        channel.

                        Send the first message and start the conversation.

                    </p>

                </div>

            ) : (

                <div className="flex-1 overflow-hidden">

                    <MessageList
                        messages={messages}
                        // onReply={onReply}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onPin={onPin}

                        canPin={canPin}
                        isOwner={isOwner}
                        isAdmin={isAdmin}
                    />
                </div>

            )}

            {/* Reply Preview */}

            {replyingTo && (

                <div className="border-t border-zinc-700 bg-zinc-800 px-6 py-3">

                    <div className="mb-1 flex items-center gap-2 text-xs text-indigo-400">

                        <Reply size={14} />

                        Replying to

                        <span className="font-semibold text-white">

                            {replyingTo.author?.username ??
                                `User ${replyingTo.author_id}`}

                        </span>

                    </div>

                    <div className="truncate rounded-lg bg-zinc-900 px-3 py-2 text-sm text-zinc-300">

                        {replyingTo.content}

                    </div>

                </div>

            )}

            <div className="border-t border-zinc-800 bg-[#313338]">

                <ChatInput
                    onSend={onSend}
                />

            </div>

        </div>

    );

};

export default ChatWindow;