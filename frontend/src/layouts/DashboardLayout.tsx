import { Outlet } from "react-router-dom";

import ServerRail from "../components/navigation/ServerRail";
import ChannelSidebar from "../components/navigation/ChannelSidebar";
import MemberSidebar from "../components/navigation/MemberSidebar";
import Topbar from "../components/navigation/Topbar";

import Spinner from "../components/common/Spinner";

import useAuth from "../hooks/useAuth";
import { useServer } from "../contexts/ServerContext";

const DashboardLayout = () => {
    const { loading: authLoading } = useAuth();

    const { loading: serverLoading } = useServer();

    if (authLoading || serverLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-950">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#1E1F22] text-white">

            <ServerRail />

            <ChannelSidebar />

            <div className="flex min-w-0 flex-1 flex-col">

                <Topbar />

                <main className="flex-1 overflow-hidden">
                    <Outlet />
                </main>

            </div>

            <MemberSidebar />

        </div>
    );
};

export default DashboardLayout;