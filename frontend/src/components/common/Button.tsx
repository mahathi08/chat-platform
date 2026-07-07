import type{
    ButtonHTMLAttributes,
    ReactNode,
} from "react";

import clsx from "clsx";

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    loading?: boolean;
    variant?: "primary" | "secondary" | "danger";
}

const Button = ({
    children,
    loading = false,
    variant = "primary",
    className,
    disabled,
    ...props
}: ButtonProps) => {
    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={clsx(
                "w-full rounded-lg px-4 py-2 font-medium transition-colors",
                "disabled:cursor-not-allowed disabled:opacity-50",

                variant === "primary" &&
                    "bg-blue-600 text-white hover:bg-blue-700",

                variant === "secondary" &&
                    "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white",

                variant === "danger" &&
                    "bg-red-600 text-white hover:bg-red-700",

                className
            )}
        >
            {loading ? "Loading..." : children}
        </button>
    );
};

export default Button;