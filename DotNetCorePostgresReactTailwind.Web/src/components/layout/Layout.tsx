
import { useState } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import GoogleLoginButton from "../GoogleLoginButton";

/**
 * Main layout for the app, including navigation, content, and footer.
 */
export default function Layout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, token, logout } = useAuth();

    // Auth buttons for desktop
    const AuthButtons = () => (
        <div className="flex items-center space-x-4">
            {token && user ? (
                <>
                    <span className="text-sm text-gray-700">Hello, {user.name}</span>
                    <button
                        onClick={logout}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >Logout</button>
                </>
            ) : (
                <GoogleLoginButton />
            )}
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Brand */}
                    <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
                        MyStore
                    </Link>
                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-6">
                        <NavLink
                            to="/products"
                            className={({ isActive }) =>
                                `text-sm font-medium transition-colors ${isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-700 hover:text-blue-600"}`
                            }
                        >Products</NavLink>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `text-sm font-medium transition-colors ${isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-700 hover:text-blue-600"}`
                            }
                        >About</NavLink>
                        <AuthButtons />
                    </div>
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle navigation menu"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
                {/* Mobile Dropdown */}
                {mobileOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200">
                        <div className="px-6 py-4 space-y-3">
                            <NavLink
                                to="/products"
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `block text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`
                                }
                            >Products</NavLink>
                            <NavLink
                                to="/about"
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `block text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`
                                }
                            >About</NavLink>
                            <div className="pt-2">
                                <AuthButtons />
                            </div>
                        </div>
                    </div>
                )}
            </nav>
            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
                <Outlet />
            </main>
            {/* Footer */}
            <footer className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} MyStore. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
