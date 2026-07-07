import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import channelService from "../../services/channel.service";
import messageService from "../../services/message.service";
import websocket from "../../services/websocket.service";

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

    const channelNumber =
        Number(channelId);

    const load = useCallback(async () => {
        if (!channelNumber) return;

        try {
            const c =
                await channelService.getChannel(
                    channelNumber
                );

            setChannel(c);

            const m =
                await messageService.getMessages(
                    channelNumber
                );

            setMessages(
                m.messages ?? m
            );
        } finally {
            setLoading(false);
        }
    }, [channelNumber]);

    useEffect(() => {
        load();
    }, [load]);

    // -----------------------------------------
    // Join / Leave websocket room
    // -----------------------------------------

    useEffect(() => {
        if (!channelNumber) return;

        websocket.joinChannel(
            channelNumber
        );

        return () => {
            websocket.leaveChannel(
                channelNumber
            );
        };
    }, [channelNumber]);

    // -----------------------------------------
    // Listen for websocket events
    // -----------------------------------------

    useEffect(() => {
        const handler = (payload: any) => {

            if (
                payload.event ===
                "message_create"
            ) {

                const message =
                    payload.message as Message;

                if (
                    message.channel_id !==
                    channelNumber
                ) {
                    return;
                }

                setMessages((old) => {

                    if (
                        old.some(
                            (m) =>
                                m.id ===
                                message.id
                        )
                    ) {
                        return old;
                    }

                    return [
                        ...old,
                        message,
                    ];
                });
            }
        };

        websocket.onMessage(
            handler
        );

        return () => {
            websocket.removeHandler(
                handler
            );
        };
    }, [channelNumber]);

    // -----------------------------------------
    // Send message
    // -----------------------------------------

    const send = async (
        content: string
    ) => {

        await messageService.sendMessage(
            channelNumber,
            content
        );

        // DO NOT update local state.
        // Wait for websocket broadcast.
    };

    if (loading)
        return <div>Loading...</div>;

    if (!channel)
        return (
            <div>
                Channel not found
            </div>
        );

    return (
        <ChatWindow
            messages={messages}
            channelName={channel.name}
            description={
                channel.description ?? ""
            }
            onSend={send}
        />
    );
};

export default ChannelPage;