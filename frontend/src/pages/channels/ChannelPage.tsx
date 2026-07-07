import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import channelService from "../../services/channel.service";
import messageService from "../../services/message.service";

import type { Channel } from "../../types/channel";
import type { Message } from "../../types/message";

import ChatWindow from "../../components/chat/ChatWindow";

const ChannelPage = () => {

    const { channelId } = useParams();

    const [channel, setChannel] =
        useState<Channel | null>(null);

    const [messages, setMessages] =
        useState<Message[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        if (!channelId) return;

        load();

    }, [channelId]);

    const load = async () => {

        try {

            const c =
                await channelService.getChannel(
                    Number(channelId)
                );

            setChannel(c);

            const m =
                await messageService.getMessages(
                    Number(channelId)
                );

            setMessages(m.messages ?? m);

        } finally {

            setLoading(false);

        }

    };

    const send = async (content: string) => {

        const message =
            await messageService.sendMessage(
                Number(channelId),
                content
            );

        setMessages((old) => [
            ...old,
            message,
        ]);

    };

    if (loading)
        return <div>Loading...</div>;

    if (!channel)
        return <div>Channel not found</div>;

    return (
        <ChatWindow
            messages={messages}
            channelName={channel.name}
            description={channel.description ?? ""}
            onSend={send}
        />
    );

};

export default ChannelPage;