import {
    KeyboardEvent,
    useState,
} from "react";

import messageService from "../../services/message.service";

interface Props {
    channelId: number;
}

const ChatInput = ({
    channelId,
}: Props) => {
    const [message, setMessage] =
        useState("");

    const send = async () => {
        const content = message.trim();

        if (!content) return;

        try {
            await messageService.sendMessage(
                channelId,
                content
            );

            setMessage("");
        } catch (err) {
            console.error(err);
        }
    };

    const onKeyDown = (
        e: KeyboardEvent<HTMLInputElement>
    ) => {
        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {
            e.preventDefault();

            send();
        }
    };

    return (
        <div className="border-t bg-white p-4 dark:bg-gray-900">

            <input
                value={message}
                onChange={(e) =>
                    setMessage(e.target.value)
                }
                onKeyDown={onKeyDown}
                placeholder="Type a message..."
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500 dark:bg-gray-800"
            />

        </div>
    );
};

export default ChatInput;