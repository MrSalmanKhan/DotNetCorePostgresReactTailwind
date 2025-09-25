import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Define application routes using React Router v6
const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />, // Main layout wrapper
        children: [
            { index: true, element: <Home /> },
            { path: "products", element: <ProtectedRoute><Products /></ProtectedRoute> },
            { path: "*", element: <NotFound /> },
        ],
    },
]);

/**
 * App root component
 * - Wraps app in GoogleOAuthProvider and AuthProvider
 * - Provides routing for all pages
 */
export default function App() {
    return (
        <GoogleOAuthProvider clientId="857130577447-i4pohemf1u4mfd2v5n17k4tqusgbb0v7.apps.googleusercontent.com">
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}