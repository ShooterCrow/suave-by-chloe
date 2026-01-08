import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { roles, isLoggedIn, isLoading, isUninitialized, isActive } = useAuth();
    const location = useLocation();
    const pathname = location.pathname

    if ((isLoading || isUninitialized) && (pathname.includes("dashboard") || pathname.includes("admin"))) {
        return null;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    const content = (
        roles.some(role => allowedRoles.includes(role))
            ? <Outlet />
            : <Navigate to="/" state={{ from: location }} replace />
    )

    return content
};

export default RequireAuth;
