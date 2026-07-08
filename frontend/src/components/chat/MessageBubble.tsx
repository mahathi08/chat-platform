import {
    Circle,
    Pin,
} from "lucide-react";

import { useState } from "react";

import type { Message } from "../../types/message";
import useAuth from "../../hooks/useAuth";
import MessageActions from "./MessageActions";

interface MessageBubbleProps {
    message: Message;

    canPin: boolean;
    isOwner: boolean;
    isAdmin: boolean;

    onReply: () => void;

    onEdit: (
        id: number,
        content: string
    ) => Promise<void>;

    onDelete: (
        id: number
    ) => Promise<void>;

    onPin: () => Promise<void>;
}

const MessageBubble = ({
    message,
    onReply,
    onEdit,
    onDelete,
    onPin,
    canPin,
    isOwner,
    isAdmin,
}: MessageBubbleProps) => {

    const username =
        message.author?.username ??
        `User ${message.author_id}`;

    const avatar =
        username.charAt(0).toUpperCase();

    const status =
        message.author?.status ??
        "OFFLINE";
        const { user } = useAuth();

        const isAuthor =
            user?.id === message.author_id;

        const age =
            (Date.now() -
                new Date(message.created_at).getTime()) /
            1000;

        const isRecent = age <= 300;

        const canEdit =
            isOwner ||
            isAdmin ||
            (isAuthor && isRecent);

        const canDelete =
            isOwner ||
            isAdmin ||
            (isAuthor && isRecent);

    const time = new Date(
        message.created_at
    ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const [editing, setEditing] =
        useState(false);

    const [content, setContent] =
        useState(message.content);

    const save = async () => {

        if (
            content.trim() === "" ||
            content === message.content
        ) {
            setEditing(false);
            return;
        }

        await onEdit(
            message.id,
            content
        );

        setEditing(false);

    };

    return (

        <div className="group relative flex gap-4 px-6 py-3 transition hover:bg-[#2e3035]">

            {/* Avatar */}

            <div className="relative flex-shrink-0">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">

                    {avatar}

                </div>

                <Circle
                    size={10}
                    fill={
                        status === "ONLINE"
                            ? "#22c55e"
                            : "#71717a"
                    }
                    className="absolute bottom-0 right-0 rounded-full border-2 border-[#313338]"
                />

            </div>

            {/* Content */}

            <div className="min-w-0 flex-1">

                <div className="flex items-center gap-3">

                    <span className="font-semibold text-white">

                        {username}

                    </span>

                    <span className="text-xs text-zinc-500">

                        {time}

                    </span>

                    {message.is_pinned && (

                        <span className="flex items-center gap-1 rounded-full bg-yellow-500/15 px-2 py-0.5 text-xs text-yellow-400">

                            <Pin size={12} />

                            Pinned

                        </span>

                    )}

                    {message.is_edited && (

                        <span className="text-xs italic text-zinc-500">

                            edited

                        </span>

                    )}

                </div>

                {message.is_deleted ? (

                    <div className="mt-1 italic text-zinc-500">

                        {message.content}

                    </div>

                ) : editing ? (

                    <div className="mt-2">

                        <textarea
                            value={content}
                            onChange={(e) =>
                                setContent(
                                    e.target.value
                                )
                            }
                            rows={3}
                            className="w-full rounded-lg border border-indigo-600 bg-zinc-800 p-3 text-white outline-none"
                        />

                        <div className="mt-2 flex gap-2">

                            <button
                                onClick={save}
                                className="rounded bg-indigo-600 px-3 py-1 text-sm hover:bg-indigo-500"
                            >
                                Save
                            </button>

                            <button
                                onClick={() => {
                                    setContent(
                                        message.content
                                    );
                                    setEditing(
                                        false
                                    );
                                }}
                                className="rounded bg-zinc-700 px-3 py-1 text-sm hover:bg-zinc-600"
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                ) : (

                    <div className="mt-1 whitespace-pre-wrap break-words leading-7 text-zinc-200">

                        {message.content}

                    </div>

                )}

            </div>

            {/* Hover Toolbar */}

            {!message.is_deleted && (

                <div className="absolute right-5 top-2">

                    <MessageActions
                        pinned={message.is_pinned}
                        canEdit={canEdit}
                        canDelete={canDelete}
                        canPin={canPin}
                        content={message.content}
                        onReply={onReply}
                        onPin={onPin}
                        onDelete={() => onDelete(message.id)}
                        onEdit={() => setEditing(true)}
                    />

                </div>

            )}

        </div>

    );

};

export default MessageBubble;