import {
    useEffect,
    useState,
} from "react";

import { useParams } from "react-router-dom";

import dmService from "../../services/dm.service";

import ChatWindow from "../../components/chat/ChatWindow";

import type { Message } from "../../types/message";

const DirectMessage = () => {

    const { conversationId } = useParams();

    const [
        messages,
        setMessages,
    ] = useState<Message[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    useEffect(() => {

        if (conversationId) {

            loadMessages();

        }

    }, [conversationId]);

    const loadMessages = async () => {

        try {

            const response =
                await dmService.getMessages(
                    Number(conversationId)
                );

            setMessages(
                response.messages ?? []
            );

        } catch (err: any) {

            setError(
                err?.response?.data?.detail ??
                "Unable to load conversation."
            );

        } finally {

            setLoading(false);

        }

    };

    const sendMessage = async (
        content: string
    ) => {

        if (!conversationId)
            return;

        try {

            const message =
                await dmService.sendMessage(
                    Number(conversationId),
                    content,
                );

            setMessages((old) => [
                ...old,
                message,
            ]);

        } catch (err) {

            console.error(err);

        }

    };

    if (loading) {

        return (

            <div className="flex h-full items-center justify-center bg-zinc-900 text-white">

                Loading conversation...

            </div>

        );

    }

    return (

        <div className="flex h-full flex-col bg-zinc-900">

            {error && (

                <div className="m-4 rounded-lg bg-red-900/30 p-3 text-red-300">

                    {error}

                </div>

            )}

            <div className="flex-1 overflow-hidden">

                <ChatWindow
                    messages={messages}
                    channelName="Direct Message"
                    description="Private conversation"
                    canPin={false}
                    isOwner={false}
                    isAdmin={false}
                    // replyingTo={null}
                    // onReply={() => {}}
                    onEdit={async () => {}}
                    onDelete={async () => {}}
                    onPin={async () => {}}
                    onSend={sendMessage}
                />

            </div>
        </div>

    );

};

export default DirectMessage;