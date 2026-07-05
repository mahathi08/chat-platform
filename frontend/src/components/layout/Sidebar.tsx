import { Link, useLocation } from "react-router-dom";

import {
    Home,
    Compass,
    Bell,
    Settings,
    Plus,
} from "lucide-react";

import clsx from "clsx";

const Sidebar = () => {
    const location = useLocation();

    const links = [
        {
            icon: Home,
            path: "/",
        },
        {
            icon: Compass,
            path: "/explore",
        },
        {
            icon: Bell,
            path: "/notifications",
        },
        {
            icon: Settings,
            path: "/settings/account",
        },
    ];

    return (
        <aside className="flex w-20 flex-col items-center gap-4 border-r border-gray-200 bg-white py-5 dark:border-gray-800 dark:bg-gray-950">

            <Link
                to="/servers/create"
                className="rounded-full bg-blue-600 p-3 text-white transition hover:bg-blue-700"
            >
                <Plus size={22} />
            </Link>

            {links.map(({ icon: Icon, path }) => (
                <Link
                    key={path}
                    to={path}
                    className={clsx(
                        "rounded-xl p-3 transition",

                        location.pathname === path
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
                    )}
                >
                    <Icon size={22} />
                </Link>
            ))}
        </aside>
    );
};

export default Sidebar;