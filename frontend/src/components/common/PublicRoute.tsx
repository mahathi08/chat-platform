import { Navigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

interface Props {
    children: React.ReactNode;
}

const PublicRoute = ({
    children,
}: Props) => {
    const {
        loading,
        isAuthenticated,
    } = useAuth();

    if (loading) {
        return <></>;
    }

    if (isAuthenticated) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return <>{children}</>;
};

export default PublicRoute;