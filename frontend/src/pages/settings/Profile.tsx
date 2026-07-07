import { useState } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

import userService from "../../services/user.service";

import useAuth from "../../hooks/useAuth";

const schema = z.object({

    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(50),

    bio: z
        .string()
        .max(300)
        .optional(),

    avatar_url: z
        .string()
        .url("Enter a valid URL")
        .optional()
        .or(z.literal("")),

});

type ProfileForm = z.infer<typeof schema>;

const Profile = () => {

    const {
        user,
        refreshUser,
    } = useAuth();

    const [
        serverError,
        setServerError,
    ] = useState("");

    const [
        success,
        setSuccess,
    ] = useState("");

    const {

        register,

        handleSubmit,

        formState: {
            errors,
            isSubmitting,
        },

    } = useForm<ProfileForm>({

        resolver: zodResolver(schema),

        defaultValues: {

            username:
                user?.username ?? "",

            bio:
                user?.bio ?? "",

            avatar_url:
                user?.avatar_url ?? "",

        },

    });

    const onSubmit = async (
        data: ProfileForm
    ) => {

        try {

            setServerError("");

            setSuccess("");

            await userService.updateProfile({

                username:
                    data.username,

                bio:
                    data.bio,

                avatar_url:
                    data.avatar_url || undefined,

            });

            await refreshUser();

            setSuccess(
                "Profile updated successfully."
            );

        } catch (error: any) {

            setServerError(

                error?.response?.data?.detail ??

                "Unable to update profile."

            );

        }

    };

    return (

        <div className="h-full overflow-y-auto bg-zinc-900 p-8">

            <div className="mx-auto max-w-2xl rounded-xl border border-zinc-800 bg-zinc-950 p-8">

                <h1 className="mb-2 text-3xl font-bold text-white">

                    Profile

                </h1>

                <p className="mb-8 text-zinc-400">

                    Update your public profile.

                </p>

                {serverError && (

                    <div className="mb-5 rounded-lg bg-red-900/30 p-3 text-red-300">

                        {serverError}

                    </div>

                )}

                {success && (

                    <div className="mb-5 rounded-lg bg-green-900/30 p-3 text-green-300">

                        {success}

                    </div>

                )}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >

                    <Input
                        label="Username"
                        error={errors.username?.message}
                        {...register("username")}
                    />

                    <Input
                        label="Avatar URL"
                        error={errors.avatar_url?.message}
                        {...register("avatar_url")}
                    />

                    <div>

                        <label className="mb-2 block text-sm font-medium text-white">

                            Bio

                        </label>

                        <textarea

                            rows={5}

                            {...register("bio")}

                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-blue-500"

                        />

                        {errors.bio && (

                            <p className="mt-2 text-sm text-red-400">

                                {errors.bio.message}

                            </p>

                        )}

                    </div>

                    <Button
                        type="submit"
                        loading={isSubmitting}
                    >

                        Save Changes

                    </Button>

                </form>

            </div>

        </div>

    );

};

export default Profile;