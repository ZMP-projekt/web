import { useState, type ReactNode } from "react";
import { AuthContext } from "../context/AuthContext.ts";
import type { JwtPayload } from "../pages/Login.tsx";
import { jwtDecode } from "jwt-decode";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("token");
    });
    const [role, setRole] = useState<string>(() => {
        if (!token) return "";

        try {
            const decoded = jwtDecode<JwtPayload>(token);
            return decoded.role;
        } catch (error) {
            console.error(error);
            return "";
        }
    });

    const login = (newToken: string, newRole: string) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("role", newRole);
        setToken(newToken);
        setRole(newRole);
    }
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setToken(null);
        setRole("");
    }

    return (
        <AuthContext.Provider
            value={{ token, role, login, logout, isAuthenticated: !!token }}
        >
            {children}
        </AuthContext.Provider>
    );
};