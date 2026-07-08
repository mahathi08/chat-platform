import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import channelService from "../../services/channel.service";
import messageService from "../../services/message.service";
import useAuth from "../../hooks/useAuth";
import serverService from "../../services/server.service";
import type { Channel } from "../../types/channel";
import type { Message } from "../../types/message";

import ChatWindow from "../../components/chat/ChatWindow";

const ChannelPage = () => {
    const { channelId } = useParams();
    const { user } = useAuth();

    const [myRole, setMyRole] =
        useState("");

    const [channel, setChannel] =
        useState<Channel | null>(null);

    const [messages, setMessages] =
        useState<Message[]>([]);

    const [loading, setLoading] =
        useState(true);

    // const [replyingTo, setReplyingTo] =
    //     useState<Message | null>(null);

    useEffect(() => {
        if (!channelId) return;

        load();
    }, [channelId]);

    const load = async () => {
        try {
            setLoading(true);

            const c =
                await channelService.getChannel(
                    Number(channelId)
                );

            setChannel(c);
            const members =
                await serverService.getMembers(
                    c.server_id
                );

            const me =
                (members.members ?? members).find(
                    (m: any) =>
                        m.user.id === user?.id
                );

            setMyRole(
                me?.role ?? ""
            );
            const m =
                await messageService.getMessages(
                    Number(channelId)
                );

            setMessages(m.messages ?? m);
        } finally {
            setLoading(false);
        }
    };

    const send = async (
        content: string
    ) => {
        const message =
            await messageService.sendMessage(
                Number(channelId),
                content,
                // replyingTo?.id
                undefined
            );

        setMessages((old) => [
            ...old,
            message,
        ]);

        // setReplyingTo(null);
    };

    const editMessage = async (
        id: number,
        content: string
    ) => {
        const updated =
            await messageService.editMessage(
                id,
                content
            );

        setMessages((old) =>
            old.map((m) =>
                m.id === id ? updated : m
            )
        );
    };

    const deleteMessage = async (
        id: number
    ) => {
        await messageService.deleteMessage(id);

        setMessages((old) =>
            old.map((m) =>
                m.id === id
                    ? {
                          ...m,
                          is_deleted: true,
                          content:
                              "This message was deleted.",
                      }
                    : m
            )
        );
    };

    const togglePin = async (
        message: Message
    ) => {
        const updated = message.is_pinned
            ? await messageService.unpinMessage(
                  message.id
              )
            : await messageService.pinMessage(
                  message.id
              );

        setMessages((old) =>
            old.map((m) =>
                m.id === message.id
                    ? updated
                    : m
            )
        );
    };

    if (loading)
        return <div>Loading...</div>;

    if (!channel)
        return (
            <div>
                Channel not found
            </div>
        );
        const isOwner = myRole === "OWNER";

        const isAdmin =
            myRole === "OWNER" ||
            myRole === "ADMIN";

    return (
        <ChatWindow
            messages={messages}
            channelName={channel.name}
            description={channel.description ?? ""}

            // replyingTo={replyingTo}

            canPin={isAdmin}
            isOwner={isOwner}
            isAdmin={isAdmin}

            // onReply={setReplyingTo}
            onEdit={editMessage}
            onDelete={deleteMessage}
            onPin={togglePin}
            onSend={send}
        />
    );
};

export default ChannelPage;