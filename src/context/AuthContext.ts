import { createContext } from "react";

export interface AuthContextType {
    token: string | null;
    role: string;
    login: (newToken: string, newRole: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);