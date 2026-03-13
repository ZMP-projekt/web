import { Navigate } from "react-router";
import { useAuth } from "../auth/useAuth.ts";
import type { JSX } from "react";

export const ProtectedRoute = ({ children, roles }: { children: JSX.Element, roles: string[] }) => {
    const { isAuthenticated, role } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!roles.includes(role)) {
        return <Navigate to={role === 'ROLE_USER' ? '/dasboard' : role === 'ROLE_TRAINER' ? '/trainer/dashboard' : '/unauthorised'} replace />;
    }

    return children
};