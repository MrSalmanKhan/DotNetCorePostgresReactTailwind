
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/apiClient";
import type { Product } from "../../types/Product";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";

import type { FC } from "react";


interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    expanded: Record<number, boolean>;
    onToggleDesc: (id: number) => void;
}


const ProductTable: FC<ProductTableProps> = ({ products, onEdit, onDelete, expanded, onToggleDesc }) => {
    if (!products.length) return <p className="text-gray-500 text-center py-8">No products found.</p>;
    return (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-100">
            <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
                <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product: Product) => (
                        <tr key={product.id} className={`transition hover:scale-[1.01] hover:shadow bg-white`}>
                            <td className="px-4 py-3 font-semibold text-gray-900 align-top">{product.id}</td>
                            <td className="px-4 py-3 align-top">{product.name}</td>
                            <td className="px-4 py-3 align-top">{product.price != null ? `$${product.price.toFixed(2)}` : ""}</td>
                            <td className="px-4 py-3 align-top max-w-md text-gray-600">
                                {product.description ? (
                                    <span>
                                        {expanded[product.id]
                                            ? product.description
                                            : product.description.length > 50
                                                ? product.description.substring(0, 50) + "..."
                                                : product.description}
                                        {product.description.length > 50 && (
                                            <button
                                                onClick={() => onToggleDesc(product.id)}
                                                className="ml-2 text-blue-600 hover:underline text-xs font-semibold"
                                            >
                                                {expanded[product.id] ? "Show less" : "Read more"}
                                            </button>
                                        )}
                                    </span>
                                ) : ""}
                            </td>
                            <td className="px-4 py-3 align-top space-x-2">
                                <button onClick={() => onEdit(product)} className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition font-semibold">Edit</button>
                                <button onClick={() => onDelete(product.id)} className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition font-semibold">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default function ProductList() {
    const { token } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    useEffect(() => { fetchProducts(); }, [search, page, token]);

    async function fetchProducts() {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.get(`/Products?search=${encodeURIComponent(search)}&page=${page}&pageSize=10`);
            const items = res.data.data ?? [];
            setProducts(Array.isArray(items) ? items : []);
            setTotalPages(res.data?.totalPages ?? res.data?.TotalPages ?? 1);
        } catch (err) {
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await apiClient.delete(`/Products/${id}`);
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch {
            alert("Failed to delete product");
        }
    }

    function handleToggleDesc(id: number) {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    if (!token) return <p className="text-red-500">Please login to view products.</p>;


    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => { setPage(1); setSearch(e.target.value); }}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                </div>
                <button onClick={() => setShowAddModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-colors font-semibold">+ Add Product</button>
            </div>

            {loading && <p className="text-gray-600 text-center py-8">Loading products...</p>}
            {error && <p className="text-red-600 text-center py-8">{error}</p>}

            {!loading && !error && (
                <>
                    <ProductTable
                        products={products}
                        onEdit={setEditProduct}
                        onDelete={handleDelete}
                        expanded={expanded}
                        onToggleDesc={handleToggleDesc}
                    />
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-6 py-2 bg-gray-200 rounded-lg font-semibold disabled:opacity-50"
                        >Previous</button>
                        <span className="text-gray-700 text-base">Page {page} of {totalPages}</span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-6 py-2 bg-gray-200 rounded-lg font-semibold disabled:opacity-50"
                        >Next</button>
                    </div>
                </>
            )}

            {/* Modals with smooth transitions */}
            <AddProductModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={fetchProducts}
            />
            <EditProductModal
                isOpen={!!editProduct}
                onClose={() => setEditProduct(null)}
                product={editProduct}
                onSuccess={fetchProducts}
            />
        </div>
    );
}
