import { useState } from "react";
import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const schema = z.object({
    email: z.email(
        "Enter a valid email"
    ),
});

type ForgotPasswordForm =
    z.infer<typeof schema>;

const ForgotPassword = () => {

    const [
        submitted,
        setSubmitted,
    ] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<ForgotPasswordForm>({
        resolver:
            zodResolver(schema),
    });

    const onSubmit = async (
        data: ForgotPasswordForm,
    ) => {
        try {

            /*
             * Backend endpoint not
             * implemented yet.
             *
             * Future:
             *
             * await authService
             *     .forgotPassword(
             *         data.email
             *     );
             */

            console.log(data);

            setSubmitted(true);

        } catch (error) {

            console.error(error);

        }
    };

    if (submitted) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-zinc-900">

                <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl dark:bg-zinc-800">

                    <h1 className="mb-4 text-2xl font-bold">
                        Check your email
                    </h1>

                    <p className="text-gray-500">
                        If an account exists,
                        a password reset link
                        has been sent.
                    </p>

                    <Link
                        to="/login"
                        className="mt-6 inline-block text-blue-600 hover:underline"
                    >
                        Back to Login
                    </Link>

                </div>

            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-zinc-900">

            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl dark:bg-zinc-800">

                <h1 className="mb-2 text-center text-3xl font-bold">
                    Forgot Password
                </h1>

                <p className="mb-6 text-center text-gray-500">
                    Enter your email to receive
                    a password reset link.
                </p>

                <form
                    onSubmit={handleSubmit(
                        onSubmit
                    )}
                    className="space-y-5"
                >

                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        error={
                            errors.email
                                ?.message
                        }
                        {...register(
                            "email"
                        )}
                    />

                    <Button
                        type="submit"
                        loading={
                            isSubmitting
                        }
                    >
                        Send Reset Link
                    </Button>

                </form>

                <div className="mt-5 text-center">

                    <Link
                        to="/login"
                        className="text-blue-600 hover:underline"
                    >
                        Back to Login
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default ForgotPassword;