import {
    useEffect,
    useMemo,
    useRef,
} from "react";

import type { Message } from "../../types/message";

import MessageBubble from "./MessageBubble";
import DateDivider from "./DateDivider";

interface MessageListProps {
    messages: Message[];

    onReply: (message: Message) => void;

    canPin: boolean;
    isOwner: boolean;
    isAdmin: boolean;

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
}

const MessageList = ({
    messages,
    onReply,
    onEdit,
    onDelete,
    onPin,
    canPin,
    isOwner,
    isAdmin,
}: MessageListProps) => {

    const bottomRef =
        useRef<HTMLDivElement>(null);

    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages]);

    const groupedMessages = useMemo(() => {

        const items: (
            | {
                  type: "date";
                  date: string;
              }
            | {
                  type: "message";
                  message: Message;
              }
        )[] = [];

        let lastDate = "";

        for (const message of messages) {

            const currentDate =
                new Date(
                    message.created_at
                ).toDateString();

            if (currentDate !== lastDate) {

                items.push({
                    type: "date",
                    date: currentDate,
                });

                lastDate = currentDate;

            }

            items.push({
                type: "message",
                message,
            });

        }

        return items;

    }, [messages]);

    if (messages.length === 0) {

        return (

            <div className="flex h-full flex-col items-center justify-center text-zinc-500">

                <div className="mb-2 text-6xl">
                    💬
                </div>

                <h2 className="text-xl font-semibold">
                    No messages yet
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                    Be the first person to start the conversation.
                </p>

            </div>

        );

    }

    return (

        <div className="flex h-full flex-col overflow-y-auto bg-[#313338]">

            <div className="flex flex-col py-4">

                {groupedMessages.map(
                    (item, index) => {

                        if (item.type === "date") {

                            return (
                                <DateDivider
                                    key={`date-${index}`}
                                    date={item.date}
                                />
                            );

                        }

                        return (

                            <MessageBubble
                                key={item.message.id}
                                message={item.message}

                                onReply={() => onReply(item.message)}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onPin={() => onPin(item.message)}

                                canPin={canPin}
                                isOwner={isOwner}
                                isAdmin={isAdmin}
                            />

                        );

                    }
                )}

                <div ref={bottomRef} />

            </div>

        </div>

    );

};

export default MessageList;