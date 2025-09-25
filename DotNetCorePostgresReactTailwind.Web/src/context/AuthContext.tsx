import { createContext, useContext, useState, type ReactNode } from "react";

// User type for authentication context
interface AuthUser {
    email: string;
    name: string;
}

// Context value type
interface AuthContextValue {
    token: string | null;
    user: AuthUser | null;
    setAuth: (token: string, user: AuthUser) => void;
    logout: () => void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// AuthProvider wraps your app and provides authentication state
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Persist token and user in localStorage for session continuity
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [user, setUser] = useState<AuthUser | null>(
        localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null
    );

    // Set authentication state and persist to localStorage
    const setAuth = (jwt: string, userData: AuthUser) => {
        setToken(jwt);
        setUser(userData);
        localStorage.setItem("token", jwt);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    // Clear authentication state and remove from localStorage
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ token, user, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to access authentication context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
