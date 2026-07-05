import { useEffect, useState } from "react";

import messageService from "../../services/message.service";

import { Message } from "../../types/message";

import MessageBubble from "./MessageBubble";

interface Props {
    channelId: number;
}

const MessageList = ({
    channelId,
}: Props) => {
    const [messages, setMessages] =
        useState<Message[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        loadMessages();
    }, [channelId]);

    const loadMessages = async () => {
        try {
            const response =
                await messageService.getMessages(
                    channelId
                );

            setMessages(
                response.messages ??
                    response
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6">

                Loading messages...

            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto">

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