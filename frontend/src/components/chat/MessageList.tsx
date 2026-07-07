import type { Message } from "../../types/message";

import MessageBubble from "./MessageBubble";

interface MessageListProps {
    messages: Message[];
}

const MessageList = ({
    messages,
}: MessageListProps) => {
    if (messages.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-zinc-500">
                No messages yet.
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col overflow-y-auto px-4 py-4">

            {messages.map((message) => (
                <MessageBubble
                    key={message.id}
                    message={message}
                />
            ))}

        </div>
    );
};

export default MessageList;