import ChatHeader from "../layout/ChatHeader";
import MessageList from "./MessageList";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";

interface ChatWindowProps {
    channelId: number;
    channelName?: string;
    description?: string;
}

const ChatWindow = ({
    channelId,
    channelName,
    description,
}: ChatWindowProps) => {
    return (
        <div className="flex h-full flex-col">

            <ChatHeader
                channelName={channelName}
                description={description}
            />

            <div className="flex-1 overflow-hidden">

                <MessageList
                    channelId={channelId}
                />

            </div>

            <TypingIndicator />

            <ChatInput
                channelId={channelId}
            />

        </div>
    );
};

export default ChatWindow;