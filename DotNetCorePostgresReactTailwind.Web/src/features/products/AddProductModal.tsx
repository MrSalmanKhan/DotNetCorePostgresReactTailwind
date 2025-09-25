
import { useEffect } from "react";
import ProductForm from "./ProductForm";
import apiClient from "../../services/apiClient";

// Props for AddProductModal
interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

/**
 * Modal for adding a new product.
 * Handles API call and modal state.
 */
export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
    useEffect(() => {
        if (!isOpen) return;
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-all duration-200" role="dialog" aria-modal="true">
            {/* Overlay */}
            <div className="absolute inset-0" onClick={onClose}></div>
            {/* Modal content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 z-10 animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6 text-blue-700">Add Product</h2>
                <ProductForm
                    onSubmit={async (values) => {
                        try {
                            await apiClient.post("/Products", values);
                            if (onSuccess) onSuccess();
                            onClose();
                        } catch (err) {
                            alert("Failed to add product");
                        }
                    }}
                    onCancel={onClose}
                />
            </div>
        </div>
    );
}
