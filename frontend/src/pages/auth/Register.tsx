import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import useAuth from "../../hooks/useAuth";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const schema = z
    .object({
        username: z
            .string()
            .min(3, "Username must be at least 3 characters"),

        email: z
            .string()
            .email("Enter a valid email"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),

        confirmPassword: z.string(),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }
    );

type RegisterForm = z.infer<typeof schema>;

const Register = () => {
    const navigate = useNavigate();

    const { register: registerUser } = useAuth();

    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<RegisterForm>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: RegisterForm) => {

        console.log("========== REGISTER ==========");
        console.log(data);

        try {

            setServerError("");

            await registerUser({
                username: data.username,
                email: data.email,
                password: data.password,
            });

            console.log("REGISTER SUCCESS");

            navigate("/");

        } catch (error: any) {

            console.log("REGISTER ERROR");
            console.log(error);
            console.log(error?.response);
            console.log(error?.response?.data);

            setServerError(
                error?.response?.data?.detail ??
                "Registration failed."
            );
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-zinc-900">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl dark:bg-zinc-800">

                <h1 className="mb-2 text-center text-3xl font-bold">
                    Create Account
                </h1>

                <p className="mb-6 text-center text-gray-500">
                    Join the chat platform
                </p>

                {serverError && (
                    <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
                        {serverError}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >

                    <Input
                        label="Username"
                        placeholder="Username"
                        error={errors.username?.message}
                        {...register("username")}
                    />

                    <Input
                        label="Email"
                        type="email"
                        placeholder="Email"
                        error={errors.email?.message}
                        {...register("email")}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Password"
                        error={errors.password?.message}
                        {...register("password")}
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm Password"
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword")}
                    />

                    <Button
                        type="submit"
                        loading={isSubmitting}
                    >
                        Register
                    </Button>

                </form>

                <div className="mt-5 text-center text-sm text-gray-500">
                    Already have an account?

                    <Link
                        to="/login"
                        className="ml-1 font-semibold text-blue-600 hover:underline"
                    >
                        Login
                    </Link>

                </div>

            </div>
        </div>
    );
};

export default Register;