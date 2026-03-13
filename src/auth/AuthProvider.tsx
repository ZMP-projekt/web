import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string>("");

    const login = (newToken: string, newRole: string) => {
        setToken(newToken);
        setRole(newRole);
    }
    const logout = () => {
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