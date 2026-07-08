import {
    Copy,
    Edit3,
    // MessageSquareReply,
    MoreHorizontal,
    Pin,
    Trash2,
} from "lucide-react";

import { useState } from "react";

interface Props {
    pinned: boolean;

    canEdit: boolean;

    canDelete: boolean;

    canPin: boolean;

    // onReply: () => void;

    onEdit: () => void;

    onDelete: () => void;

    onPin: () => void;

    content: string;
}

const MessageActions = ({
    pinned,
    canEdit,
    canDelete,
    canPin,
    // onReply,
    onEdit,
    onDelete,
    onPin,
    content,
}: Props) => {

    const [open, setOpen] =
        useState(false);

    const copy = async () => {

        await navigator.clipboard.writeText(
            content
        );

        setOpen(false);

    };

    return (

        <div className="relative opacity-0 transition-all duration-200 group-hover:opacity-100">

            <button
                onClick={() =>
                    setOpen((v) => !v)
                }
                className="rounded-md p-1 hover:bg-zinc-700"
            >
                <MoreHorizontal size={18} />
            </button>

            {open && (

                <div className="absolute right-0 top-8 z-50 w-52 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">

                    {/* <button
                        onClick={() => {
                            onReply();
                            setOpen(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 hover:bg-zinc-800"
                    >
                        <MessageSquareReply size={17} />
                        Reply
                    </button> */}

                    {canEdit  && (

                        <button
                            onClick={() => {
                                onEdit();
                                setOpen(false);
                            }}
                            className="flex w-full items-center gap-3 px-4 py-3 hover:bg-zinc-800"
                        >
                            <Edit3 size={17} />
                            Edit
                        </button>

                    )}

                    {canPin && (

                        <button
                            onClick={() => {
                                onPin();
                                setOpen(false);
                            }}
                            className="flex w-full items-center gap-3 px-4 py-3 hover:bg-zinc-800"
                        >

                            <Pin size={17} />

                            {pinned
                                ? "Unpin"
                                : "Pin"}

                        </button>

                    )}

                    <button
                        onClick={copy}
                        className="flex w-full items-center gap-3 px-4 py-3 hover:bg-zinc-800"
                    >
                        <Copy size={17} />
                        Copy Text
                    </button>

                    {canDelete && (

                        <button
                            onClick={() => {
                                onDelete();
                                setOpen(false);
                            }}
                            className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-600/20"
                        >
                            <Trash2 size={17} />
                            Delete
                        </button>

                    )}

                </div>

            )}

        </div>

    );

};

export default MessageActions;