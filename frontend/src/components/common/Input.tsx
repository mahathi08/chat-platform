import {
    forwardRef,
    InputHTMLAttributes,
} from "react";

import clsx from "clsx";

interface InputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<
    HTMLInputElement,
    InputProps
>(({ label, error, className, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="mb-2 block text-sm font-medium">
                    {label}
                </label>
            )}

            <input
                ref={ref}
                {...props}
                className={clsx(
                    "w-full rounded-lg border border-gray-300 px-4 py-2",
                    "focus:border-blue-500 focus:outline-none",
                    "dark:border-gray-700 dark:bg-gray-800",
                    className
                )}
            />

            {error && (
                <p className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;