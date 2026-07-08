import {
    useRef,
    useState,
} from "react";

import type {
    ChangeEvent,
    KeyboardEvent,
} from "react";

import {
    SendHorizonal,
    Paperclip,
    Smile,
} from "lucide-react";

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

    const textareaRef =
        useRef<HTMLTextAreaElement>(null);

    const autoResize = () => {

        if (!textareaRef.current) return;

        textareaRef.current.style.height =
            "0px";

        textareaRef.current.style.height =
            `${Math.min(
                textareaRef.current.scrollHeight,
                180
            )}px`;

    };

    const handleChange = (
        e: ChangeEvent<HTMLTextAreaElement>
    ) => {

        setMessage(e.target.value);

        autoResize();

    };

    const send = async () => {

        const content = message.trim();

        if (!content || sending)
            return;

        try {

            setSending(true);

            await onSend(content);

            setMessage("");

            if (textareaRef.current) {

                textareaRef.current.style.height =
                    "48px";

            }

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

        <div className="border-t border-zinc-800 bg-zinc-950 px-6 py-5">

            <div className="rounded-xl border border-zinc-800 bg-zinc-900">

                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={message}
                    onChange={handleChange}
                    onKeyDown={onKeyDown}
                    placeholder="Message #general"
                    className="
                        min-h-12
                        max-h-44
                        w-full
                        resize-none
                        overflow-y-auto
                        rounded-t-xl
                        bg-transparent
                        px-5
                        py-4
                        text-white
                        outline-none
                        placeholder:text-zinc-500
                    "
                />

                <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-2">

                    <div className="flex items-center gap-2">

                        <button
                            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                            title="Attach file"
                        >

                            <Paperclip size={20} />

                        </button>

                        <button
                            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-yellow-400"
                            title="Emoji"
                        >

                            <Smile size={20} />

                        </button>

                    </div>

                    <button
                        onClick={send}
                        disabled={
                            sending ||
                            message.trim() === ""
                        }
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-lg
                            bg-indigo-600
                            px-5
                            py-2
                            font-medium
                            text-white
                            transition
                            hover:bg-indigo-500
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >

                        <SendHorizonal size={18} />

                        {sending
                            ? "Sending..."
                            : "Send"}

                    </button>

                </div>

            </div>

            <div className="mt-2 flex justify-between px-1 text-xs text-zinc-500">

                <span>

                    Press <b>Enter</b> to send

                </span>

                <span>

                    <b>Shift + Enter</b> for a new line

                </span>

            </div>

        </div>

    );

};

export default ChatInput;