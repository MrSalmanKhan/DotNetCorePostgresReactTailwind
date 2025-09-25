
import { useAuth } from "../context/AuthContext";
import ProductList from "../features/products/ProductList";

/**
 * Products page. Shows product list if authenticated, else prompts login.
 * Beautified and responsive with TailwindCSS.
 */
export default function Products() {
    const { token } = useAuth();
    return (
        <section className="max-w-5xl mx-auto w-full px-2 sm:px-4 md:px-8 py-8 min-h-[60vh]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 drop-shadow-sm">Products</h1>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
                {!token ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-red-500 text-lg mb-4">Please login to view the products.</p>
                    </div>
                ) : (
                    <ProductList />
                )}
            </div>
        </section>
    );
}
