
import React from "react";
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "./GoogleLoginButton";




export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { token } = useAuth();
    if (!token) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
                    <h2 className="text-lg font-semibold mb-4">Please log in to access this page</h2>
                    <GoogleLoginButton />
                </div>
            </div>
        );
    }
    return <>{children}</>;
}
