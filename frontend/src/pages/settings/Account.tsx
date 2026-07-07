import { useState } from "react";

import useAuth from "../../hooks/useAuth";

import Button from "../../components/common/Button";

const Account = () => {

    const {
        user,
        logout,
    } = useAuth();

    const [
        loading,
        setLoading,
    ] = useState(false);

    const handleLogout = async () => {

        try {

            setLoading(true);

            await logout();

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="h-full overflow-y-auto bg-zinc-900 p-8">

            <div className="mx-auto max-w-3xl">

                <h1 className="mb-2 text-3xl font-bold text-white">

                    Account Settings

                </h1>

                <p className="mb-8 text-zinc-400">

                    Manage your account information.

                </p>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">

                    <div className="flex items-center gap-5">

                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">

                            {user?.username?.charAt(0).toUpperCase()}

                        </div>

                        <div>

                            <h2 className="text-2xl font-semibold text-white">

                                {user?.username}

                            </h2>

                            <p className="text-zinc-400">

                                {user?.email}

                            </p>

                        </div>

                    </div>

                    <div className="mt-8 grid gap-6">

                        <div>

                            <label className="text-sm text-zinc-400">

                                Username

                            </label>

                            <div className="mt-1 rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-white">

                                {user?.username}

                            </div>

                        </div>

                        <div>

                            <label className="text-sm text-zinc-400">

                                Email

                            </label>

                            <div className="mt-1 rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-white">

                                {user?.email}

                            </div>

                        </div>

                    </div>

                    <div className="mt-10 border-t border-zinc-800 pt-8">

                        <h3 className="mb-3 text-lg font-semibold text-red-400">

                            Danger Zone

                        </h3>

                        <p className="mb-6 text-sm text-zinc-400">

                            Logging out will remove your local session. You can
                            sign in again at any time.

                        </p>

                        <Button
                            onClick={handleLogout}
                            loading={loading}
                        >
                            Logout
                        </Button>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Account;