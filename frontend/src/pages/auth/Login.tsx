import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import useAuth from "../../hooks/useAuth";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const schema = z.object({
    email: z.email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof schema>;

const Login = () => {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            setServerError("");

            await login(data);

            navigate("/");
        } catch (error: any) {
            setServerError(
                error?.response?.data?.detail ??
                "Invalid email or password."
            );
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">

                <h1 className="mb-2 text-center text-3xl font-bold">
                    Welcome Back
                </h1>

                <p className="mb-6 text-center text-gray-500">
                    Sign in to continue
                </p>

                {serverError && (
                    <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
                        {serverError}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter email"
                        error={errors.email?.message}
                        {...register("email")}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter password"
                        error={errors.password?.message}
                        {...register("password")}
                    />

                    <Button
                        type="submit"
                        loading={isSubmitting}
                    >
                        Login
                    </Button>
                </form>

                <div className="mt-5 text-center">
                    <Link
                        to="/forgot-password"
                        className="text-blue-600"
                    >
                        Forgot Password?
                    </Link>
                </div>

                <div className="mt-4 text-center">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-blue-600"
                    >
                        Register
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Login;