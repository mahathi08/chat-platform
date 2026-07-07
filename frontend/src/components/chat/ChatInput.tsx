import { useState } from "react";

import type { KeyboardEvent } from "react";

interface ChatInputProps {
    onSend: (content: string) => Promise<void>;
}

const ChatInput = ({
    onSend,
}: ChatInputProps) => {

    const [message, setMessage] =
        useState("");

    const [sending, setSending] =
        useState(false);

    const send = async () => {

        const content = message.trim();

        if (!content || sending)
            return;

        try {

            setSending(true);

            await onSend(content);

            setMessage("");

        } finally {

            setSending(false);

        }

    };

    const onKeyDown = (
        e: KeyboardEvent<HTMLTextAreaElement>
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

        <div className="border-t border-zinc-800 bg-zinc-900 p-4">

            <div className="flex gap-3">

                <textarea
                    rows={2}
                    value={message}
                    onChange={(e) =>
                        setMessage(
                            e.target.value
                        )
                    }
                    onKeyDown={onKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                />

                <button
                    onClick={send}
                    disabled={
                        sending ||
                        message.trim().length === 0
                    }
                    className="rounded-lg bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >

                    {sending
                        ? "..."
                        : "Send"}

                </button>

            </div>

            <p className="mt-2 text-xs text-zinc-500">
                Press Enter to send • Shift + Enter for a new line
            </p>

        </div>

    );

};

export default ChatInput;