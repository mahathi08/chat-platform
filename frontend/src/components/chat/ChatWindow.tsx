import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

import type { Message } from "../../types/message";

interface ChatWindowProps {
    messages: Message[];
    channelName?: string;
    description?: string;
    onSend: (content: string) => Promise<void>;
}

const ChatWindow = ({
    messages,
    channelName,
    description,
    onSend,
}: ChatWindowProps) => {
    return (
        <div className="flex h-full flex-col">

            <ChatHeader
                channelName={channelName}
                description={description}
            />

            <div className="flex-1 overflow-hidden">
                <MessageList messages={messages} />
            </div>

            <ChatInput onSend={onSend} />

        </div>
    );
};

export default ChatWindow;