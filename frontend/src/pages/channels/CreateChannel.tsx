import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

import channelService from "../../services/channel.service";

const schema = z.object({
    name: z
        .string()
        .min(2, "Channel name must be at least 2 characters")
        .max(50),

    description: z
        .string()
        .max(250)
        .optional(),

    type: z.enum([
        "TEXT",
        "VOICE",
        "ANNOUNCEMENT",
    ]),
});

type CreateChannelForm = z.infer<typeof schema>;

const CreateChannel = () => {

    const { serverId } = useParams();

    const navigate = useNavigate();

    const [
        serverError,
        setServerError,
    ] = useState("");

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<CreateChannelForm>({
        resolver: zodResolver(schema),

        defaultValues: {
            type: "TEXT",
        },
    });

    const onSubmit = async (
        data: CreateChannelForm
    ) => {

        if (!serverId)
            return;

        try {

            setServerError("");

            const channel =
                await channelService.createChannel(
                    Number(serverId),
                    {
                        name: data.name,
                        description: data.description,
                        type: data.type,
                    }
                );

            navigate(
                `/channels/${channel.id}`
            );

        } catch (error: any) {

            setServerError(
                error?.response?.data?.detail ??
                    "Unable to create channel."
            );

        }

    };

    return (

        <div className="flex h-full items-center justify-center bg-zinc-900 p-8">

            <div className="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-950 p-8">

                <h1 className="mb-2 text-3xl font-bold text-white">

                    Create Channel

                </h1>

                <p className="mb-8 text-zinc-400">

                    Add a new channel to your server.

                </p>

                {serverError && (

                    <div className="mb-6 rounded-lg bg-red-900/30 p-3 text-red-300">

                        {serverError}

                    </div>

                )}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >

                    <Input
                        label="Channel Name"
                        placeholder="general"
                        error={
                            errors.name?.message
                        }
                        {...register("name")}
                    />

                    <Input
                        label="Description"
                        placeholder="General discussion"
                        error={
                            errors.description?.message
                        }
                        {...register(
                            "description"
                        )}
                    />

                    <div>

                        <label className="mb-2 block text-sm font-medium text-white">

                            Channel Type

                        </label>

                        <select
                            {...register("type")}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                        >

                            <option value="TEXT">
                                Text
                            </option>

                            <option value="VOICE">
                                Voice
                            </option>

                            <option value="ANNOUNCEMENT">
                                Announcement
                            </option>

                        </select>

                    </div>

                    <Button
                        type="submit"
                        loading={isSubmitting}
                    >

                        Create Channel

                    </Button>

                </form>

            </div>

        </div>

    );

};

export default CreateChannel;