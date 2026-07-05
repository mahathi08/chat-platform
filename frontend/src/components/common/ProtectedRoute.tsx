import { Navigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import Spinner from "./Spinner";

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute = ({
    children,
}: Props) => {
    const {
        loading,
        isAuthenticated,
    } = useAuth();

    if (loading) {
        return <Spinner />;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;