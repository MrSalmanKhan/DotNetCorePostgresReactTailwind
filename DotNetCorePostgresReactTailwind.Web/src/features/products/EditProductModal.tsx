
import { useEffect } from "react";
import ProductForm from "./ProductForm";
import type { Product } from "../../types/Product";
import apiClient from "../../services/apiClient";

// Props for EditProductModal
interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onSuccess?: () => void;
}

/**
 * Modal for editing an existing product.
 * Handles API call and modal state.
 */
export default function EditProductModal({ isOpen, onClose, product, onSuccess }: EditProductModalProps) {
    useEffect(() => {
        if (!isOpen) return;
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-all duration-200" role="dialog" aria-modal="true">
            {/* Overlay */}
            <div className="absolute inset-0" onClick={onClose}></div>
            {/* Modal content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 z-10 animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6 text-blue-700">Edit Product</h2>
                <ProductForm
                    initialValues={product}
                    onSubmit={async (values) => {
                        if (!product) return;
                        try {
                            await apiClient.put(`/Products/${product.id}`, { ...values, id: product.id });
                            if (onSuccess) onSuccess();
                            onClose();
                        } catch (err) {
                            alert("Failed to update product");
                        }
                    }}
                    onCancel={onClose}
                />
            </div>
        </div>
    );
}
