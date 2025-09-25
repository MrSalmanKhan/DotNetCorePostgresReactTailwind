
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

/**
 * GoogleLoginButton component for Google OAuth login.
 * On success, exchanges Google credential for JWT and user info from backend.
 */
const GoogleLoginButton: React.FC = () => {
    const { setAuth } = useAuth();

    // Handle Google login success
    const handleLogin = async (credentialResponse: any) => {
        const idToken = credentialResponse.credential;
        try {
            const res = await fetch("https://localhost:7092/api/auth/google-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(idToken),
            });
            const data = await res.json();
            setAuth(data.token, data.user); // Store JWT and user info
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    return <GoogleLogin onSuccess={handleLogin} onError={() => console.log("Login Failed")} />;
};

export default GoogleLoginButton;
