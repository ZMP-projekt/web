import { Navigate } from "react-router";
import { useAuth} from "../auth/useAuth.ts";
import type {JSX} from "react";

export const ProtectedRoute = ({ children}: { children: JSX.Element }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children
};