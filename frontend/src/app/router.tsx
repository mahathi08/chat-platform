import {
    createBrowserRouter,
} from "react-router-dom";

// Layout
import DashboardLayout from "../layouts/DashboardLayout";

// Route Guards
import ProtectedRoute from "../components/common/ProtectedRoute";
import PublicRoute from "../components/common/PublicRoute";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

// Dashboard
import Home from "../pages/dashboard/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import Explore from "../pages/dashboard/Explore";

// Servers
import ServerPage from "../pages/servers/ServerPage";
import CreateServer from "../pages/servers/CreateServer";
import MembersPage from "../pages/servers/MembersPage";
import InvitePage from "../pages/servers/InvitePage";

// Channels
import ChannelPage from "../pages/channels/ChannelPage";
import CreateChannel from "../pages/channels/CreateChannel";

// DMs
import DirectMessage from "../pages/dms/DirectMessage";

// Notifications
import Notifications from "../pages/notifications/Notifications";

// Settings
import Account from "../pages/settings/Account";
import Profile from "../pages/settings/Profile";
import Appearance from "../pages/settings/Appearance";

// 404
import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
    {
        path: "/login",
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
        errorElement: <NotFound />,
    },

    {
        path: "/register",
        element: (
            <PublicRoute>
                <Register />
            </PublicRoute>
        ),
        errorElement: <NotFound />,
    },

    {
        path: "/forgot-password",
        element: (
            <PublicRoute>
                <ForgotPassword />
            </PublicRoute>
        ),
        errorElement: <NotFound />,
    },

    {
        path: "/",
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        errorElement: <NotFound />,

        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "explore",
                element: <Explore />,
            },
            {
                path: "servers/create",
                element: <CreateServer />,
            },
            {
                path: "servers/:serverId",
                element: <ServerPage />,
            },
            {
                path: "servers/:serverId/members",
                element: <MembersPage />,
            },
            {
                path: "servers/:serverId/invite",
                element: <InvitePage />,
            },
            {
                path: "servers/:serverId/channels/create",
                element: <CreateChannel />,
            },
            {
                path: "channels/:channelId",
                element: <ChannelPage />,
            },
            {
                path: "dm/:conversationId",
                element: <DirectMessage />,
            },
            {
                path: "notifications",
                element: <Notifications />,
            },
            {
                path: "settings/account",
                element: <Account />,
            },
            {
                path: "settings/profile",
                element: <Profile />,
            },
            {
                path: "settings/appearance",
                element: <Appearance />,
            },
        ],
    },

    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;