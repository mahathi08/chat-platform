import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ServerSidebar from "./ServerSidebar";
import RightSidebar from "./RightSidebar";

import Spinner from "../common/Spinner";

import useAuth from "../../hooks/useAuth";
import { useServer } from "../../contexts/ServerContext";

const DashboardLayout = () => {
    const {
        loading: authLoading,
    } = useAuth();

    const {
        loading: serverLoading,
    } = useServer();

    if (authLoading || serverLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-950">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-zinc-950 text-white">

            {/* Left Navigation */}
            <Sidebar />

            {/* Server List */}
            <ServerSidebar />

            {/* Main Content */}
            <div className="flex min-w-0 flex-1 flex-col">

                <Navbar />

                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>

            </div>

            {/* Right Sidebar */}
            <RightSidebar />

        </div>
    );
};

export default DashboardLayout;