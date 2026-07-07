import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

import serverService from "../../services/server.service";

import { useServer } from "../../contexts/ServerContext";

const schema = z.object({
    name: z
        .string()
        .min(3, "Server name must be at least 3 characters")
        .max(100),

    description: z
        .string()
        .max(500)
        .optional(),
});

type CreateServerForm = z.infer<typeof schema>;

const CreateServer = () => {

    const navigate = useNavigate();

    const {
        refreshServers,
    } = useServer();

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
    } = useForm<CreateServerForm>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (
        data: CreateServerForm
    ) => {

        try {

            setServerError("");

            const server =
                await serverService.createServer({
                    name: data.name,
                    description: data.description,
                });

            await refreshServers();

            navigate(
                `/servers/${server.id}`
            );

        } catch (error: any) {

            setServerError(
                error?.response?.data?.detail ??
                    "Unable to create server."
            );

        }

    };

    return (

        <div className="flex h-full items-center justify-center bg-zinc-900 p-8">

            <div className="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-950 p-8">

                <h1 className="mb-2 text-3xl font-bold text-white">

                    Create Server

                </h1>

                <p className="mb-8 text-zinc-400">

                    Create a new community and start chatting.

                </p>

                {serverError && (

                    <div className="mb-6 rounded-lg bg-red-900/40 p-3 text-red-300">

                        {serverError}

                    </div>

                )}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >

                    <Input
                        label="Server Name"
                        placeholder="Programming Hub"
                        error={errors.name?.message}
                        {...register("name")}
                    />

                    <Input
                        label="Description"
                        placeholder="Tell people about your server..."
                        error={
                            errors.description?.message
                        }
                        {...register("description")}
                    />

                    <Button
                        type="submit"
                        loading={isSubmitting}
                    >
                        Create Server
                    </Button>

                </form>

            </div>

        </div>

    );

};

export default CreateServer;