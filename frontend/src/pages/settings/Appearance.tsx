import { Monitor, Moon, Sun } from "lucide-react";

import { useTheme } from "../../contexts/ThemeContext";

const Appearance = () => {

    const {
        theme,
        setTheme,
    } = useTheme();

    const themes = [
        {
            id: "light",
            title: "Light",
            description: "Bright interface",
            icon: Sun,
        },
        {
            id: "dark",
            title: "Dark",
            description: "Dark interface",
            icon: Moon,
        },
        {
            id: "system",
            title: "System",
            description: "Use operating system theme",
            icon: Monitor,
        },
    ];

    return (

        <div className="h-full overflow-y-auto bg-zinc-900 p-8">

            <div className="mx-auto max-w-3xl">

                <h1 className="mb-2 text-3xl font-bold text-white">

                    Appearance

                </h1>

                <p className="mb-8 text-zinc-400">

                    Choose how the application looks.

                </p>

                <div className="space-y-4">

                    {themes.map(
                        ({
                            id,
                            title,
                            description,
                            icon: Icon,
                        }) => (

                            <button
                                key={id}
                                onClick={() =>
                                    setTheme(
                                        id as
                                            | "light"
                                            | "dark"
                                            | "system"
                                    )
                                }
                                className={`flex w-full items-center justify-between rounded-xl border p-6 transition ${
                                    theme === id
                                        ? "border-blue-600 bg-blue-900/20"
                                        : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                                }`}
                            >

                                <div className="flex items-center gap-5">

                                    <div className="rounded-lg bg-zinc-800 p-3">

                                        <Icon
                                            size={24}
                                            className="text-white"
                                        />

                                    </div>

                                    <div className="text-left">

                                        <h2 className="font-semibold text-white">

                                            {title}

                                        </h2>

                                        <p className="text-sm text-zinc-400">

                                            {description}

                                        </p>

                                    </div>

                                </div>

                                {theme === id && (

                                    <span className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white">

                                        Active

                                    </span>

                                )}

                            </button>

                        )
                    )}

                </div>

            </div>

        </div>

    );

};

export default Appearance;