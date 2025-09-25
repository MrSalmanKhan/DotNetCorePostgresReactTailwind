
import { Link, useNavigate } from "react-router-dom";

/**
 * NotFound page for 404 errors.
 * Provides navigation options to go home or back.
 */
export default function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="max-w-xl text-center">
                <h1 className="text-6xl font-extrabold text-gray-800 mb-2">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page not found</h2>
                <p className="text-gray-500 mb-6">
                    The page you're looking for doesn't exist or has been moved. Check the URL or try one of the actions below.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to="/"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
                    >
                        Go to Home
                    </Link>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Go Back
                    </button>
                </div>
                <p className="mt-6 text-xs text-gray-400">If you think this is an error, please contact support.</p>
            </div>
        </div>
    );
}
